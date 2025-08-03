import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TouchableOpacity, Keyboard, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useLocalSearchParams, router } from 'expo-router';
import { User, isFamilyCareSeeker } from '@/types/User';
import RequestSessionHeader from './RequestSessionHeader';
import DateTimeRow from './DateTimeRow';
import SessionLengthSelector from './SessionLengthSelector';
import BillingCard from './BillingCard';
import HelpOptionsDropdown from './HelpOptionsDropdown';
import SessionChecklist from './SessionChecklist';
import CareRecipientSelector from './CareRecipientSelector';
import LocationDisplay from './LocationDisplay';
import { mergeDateAndTime, roundDateTo15Min, enforceTwoHourBuffer } from '@/lib/datetimes/datetimeHelpers';
import { RootState } from '@/redux/store';
import { useSelector, useDispatch } from 'react-redux';
import { clearActiveProfile } from '@/redux/activeProfileSlice';
import { requestSession, updateSession } from '@/features/sessions/api/sessionApi';
import { SessionDTO } from '@/types/dtos/SessionDto';
import { Ionicons } from '@expo/vector-icons';
import { PrivacyPolicyLink, PrivacyPolicyModal } from '@/features/privacy';
import { usePricingQuote } from '@/features/pricing/api/usePricingQuote';

interface SessionData {
	id: string;
	senderId: string;
	receiverId: string;
	participants: string[];
	status: string;
	createdAt: string;
	confirmedBy: string[];
	note?: string;
	startTime?: string;
	endTime?: string;
	billingDetails?: {
		basePrice: number;
		taxes: number;
		serviceFee: number;
		total: number;
	};
	careRecipientId?: string;
	careRecipientType?: 'self' | 'family';
}

const RequestSession = () => {
	const { otherUserId, sessionObj } = useLocalSearchParams();
	const dispatch = useDispatch();
	
	// Get target user from multiple sources with fallback hierarchy
	const targetUserFromAllUsers = useSelector(
		(state: RootState) =>
			Object.values(state.user.allUsers).find(
				(user) => user.id === otherUserId,
			) as User,
	);
	const activeProfile = useSelector((state: RootState) => state.activeProfile.activeUser);
	
	// For family member cards, prioritize activeProfile since otherUserId is synthetic
	// and won't be found in allUsers
	const targetUserObj: User = (() => {
		// If activeProfile is a family member card, use it directly
		if (activeProfile?.isFamilyMemberCard) {
			return activeProfile;
		}
		
		// Otherwise, try to find by otherUserId first, then fall back to activeProfile
		return targetUserFromAllUsers || 
			(activeProfile?.id === otherUserId ? activeProfile : null) || 
			activeProfile;
	})();
	
	const existingSession: SessionData | null = sessionObj
		? JSON.parse(sessionObj as string)
		: null;

	const [helpText, setHelpText] = useState<string>(
		existingSession?.note || '',
	);
	const [startDate, setStartDate] = useState<Date | null>(
		existingSession?.startTime ? new Date(existingSession.startTime) : null,
	);
	const [endDate, setEndDate] = useState<Date | null>(
		existingSession?.endTime ? new Date(existingSession.endTime) : null,
	);
	// Session length in hours.
	const [sessionLength, setSessionLength] = useState<number>(0);

	// For date/time picker.
	const [isDatePickerVisible, setDatePickerVisible] = useState(false);
	const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
	const [pickerTarget, setPickerTarget] = useState<'start' | 'end'>('start');

	const [checklist, setChecklist] = useState<string[]>([]);

	// New state for care recipient selection
	const [selectedCareRecipient, setSelectedCareRecipient] = useState<string | null>(
		existingSession?.careRecipientId || null
	);
	const [selectedCareRecipientData, setSelectedCareRecipientData] = useState<any>(null);
	
	// State for privacy policy modal
	const [showPrivacyModal, setShowPrivacyModal] = useState(false);

	const currentUser = useSelector((state: RootState) => state.user.userData);
	const pswRate = currentUser?.isPsw
		? currentUser.rate || 20
		: targetUserObj?.isPsw
			? targetUserObj?.rate || 20
			: 20; // fallback default rate

	// The dynamic base price is computed as the PSW rate multiplied by the session length.
	const basePrice = pswRate * sessionLength;
	// Fixed additional costs.
	const taxes = basePrice * 0.13;
	const serviceFee = basePrice * 0.1;
	const total = basePrice + taxes + serviceFee;
	// ------------------------------------

	// Get current user's care recipient type and data - check isPsw first
	const isLookingForFamily = isFamilyCareSeeker(currentUser);
	
	// Determine if location should be shown and what location to display
	const shouldShowLocation = () => {
		// PSWs always show their location
		if (currentUser?.isPsw) {
			return true;
		}
		// Show location if user is looking for self (prefilled with their location)
		if (currentUser?.lookingForSelf === true) {
			return true;
		}
		// Show location if user is looking for family member AND a recipient is selected
		if (isLookingForFamily && selectedCareRecipientData) {
			return true;
		}
		return false;
	};

	const getLocationToDisplay = () => {
		// PSWs show their own location
		if (currentUser?.isPsw) {
			return currentUser?.address?.fullAddress || '';
		}
		if (currentUser?.lookingForSelf === true) {
			return currentUser?.address?.fullAddress || '';
		}
		if (isLookingForFamily && selectedCareRecipientData) {
			return selectedCareRecipientData.address?.fullAddress || '';
		}
		return '';
	};

	// On mount, compute session length if startDate and endDate exist.
	useEffect(() => {
		if (startDate && endDate) {
			const diffMs = endDate.getTime() - startDate.getTime();
			const diffHours = diffMs / (1000 * 60 * 60);
			setSessionLength(Math.max(diffHours, 0));
		}
	}, []);

	// Recompute endDate when sessionLength changes.
	useEffect(() => {
		if (startDate && sessionLength > 0) {
			const newEnd = new Date(
				startDate.getTime() + sessionLength * 60 * 60 * 1000,
			);
			setEndDate(newEnd);
		}
	}, [sessionLength, startDate]);

	// Clear activeProfile when component unmounts or otherUserId changes to prevent stale data
	useEffect(() => {
		return () => {
			// Only clear if activeProfile doesn't match the current otherUserId
			if (activeProfile && activeProfile.id !== otherUserId) {
				dispatch(clearActiveProfile()); // Changed from clearActiveProfile to setActiveProfile(null)
			}
		};
	}, [otherUserId, activeProfile, dispatch]);

	// Handle care recipient selection
	const handleCareRecipientSelect = (recipientId: string | null, recipientData: any) => {
		setSelectedCareRecipient(recipientId);
		setSelectedCareRecipientData(recipientData);
	};

	const formatSessionLength = (lengthHrs: number) => {
		const hours = Math.floor(lengthHrs);
		const minutes = Math.round((lengthHrs - hours) * 60);
		return `${hours}:${minutes.toString().padStart(2, '0')}`;
	};

	const showDatePicker = (target: 'start' | 'end', mode: 'date' | 'time') => {
		setPickerTarget(target);
		setPickerMode(mode);
		setDatePickerVisible(true);
	};
	const hideDatePicker = () => setDatePickerVisible(false);

	const handleConfirm = (selectedDate: Date) => {
		if (pickerTarget === 'start') {
			let newStart: Date;
			if (pickerMode === 'date') {
				newStart = startDate
					? mergeDateAndTime(selectedDate, startDate)
					: selectedDate;
			} else {
				newStart = startDate
					? mergeDateAndTime(startDate, selectedDate)
					: selectedDate;
			}
			newStart = roundDateTo15Min(newStart);
			newStart = enforceTwoHourBuffer(newStart);
			setStartDate(newStart);
			if (sessionLength > 0) {
				setEndDate(
					new Date(
						newStart.getTime() + sessionLength * 60 * 60 * 1000,
					),
				);
			}
		} else {
			let newEnd: Date;
			if (pickerMode === 'date') {
				newEnd = endDate
					? mergeDateAndTime(selectedDate, endDate)
					: selectedDate;
			} else {
				newEnd = endDate
					? mergeDateAndTime(endDate, selectedDate)
					: selectedDate;
			}
			newEnd = roundDateTo15Min(newEnd);
			setEndDate(newEnd);
			if (startDate) {
				const diffMs = newEnd.getTime() - startDate.getTime();
				setSessionLength(diffMs / (1000 * 60 * 60));
			}
		}
		hideDatePicker();
	};

	const incrementSessionLength = (hours = 0.5) => {
		setSessionLength((prev) => prev + hours);
	};

	// Format date/time for display.
	const formatDate = (date: Date | null) => {
		if (!date) return 'Select Date';
		return date.toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		});
	};
	const formatTime = (date: Date | null) => {
		if (!date) return 'Select Time';
		return date.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
		});
	};

	const handleSubmit = async () => {
		Keyboard.dismiss();
		if (!currentUser) {
			alert('You must be signed in to send a request.');
			return;
		}
		if (!helpText.trim()) {
			alert('Please specify what you need help with.');
			return;
		}
		if (!startDate || !endDate) {
			alert('Please select both start and end times.');
			return;
		}

		// Validate care recipient selection if looking for family member
		if (isLookingForFamily && currentUser?.familyMembers && currentUser.familyMembers.length > 0 && !selectedCareRecipient) {
			alert('Please select who will receive care.');
			return;
		}

		try {
			const sessionData = {
				note: helpText,
				startTime: startDate.toISOString(),
				endTime: endDate.toISOString(),
				billingDetails: {
					dynamicBasePrice: basePrice,
					taxes,
					serviceFee,
					total,
				},
				checklist: checklist.map((task, index) => ({
					id: index.toString(),
					task,
					completed: false
				})),
				// Add care recipient data
				careRecipientId: selectedCareRecipient || currentUser.id,
				careRecipientType: (isLookingForFamily && selectedCareRecipient) ? 'family' as const : 'self' as const,
			};

			if (existingSession) {
				console.log('session id', existingSession.id);
				await updateSession(existingSession.id, {
					...sessionData,
					billingDetails: {
						...sessionData.billingDetails,
						basePrice: sessionData.billingDetails.dynamicBasePrice,
					},
					checklist: checklist.map((task, index) => ({
						id: index.toString(),
						task,
						completed: false,
						checked: false,
						time: ''
					})),
				});
				alert('Session updated successfully!');
				router.back();
			} else {
				// For family member cards, use the original core user ID (without -family- suffix)
				const receiverId = (() => {
					if (targetUserObj?.isFamilyMemberCard && targetUserObj?.id) {
						// Extract original user ID from synthetic family member ID
						const originalUserId = targetUserObj.id.split('-family-')[0];
						return originalUserId;
					}
					return targetUserObj?.id || otherUserId as string;
				})();

				if (!receiverId) {
					alert('Unable to find target user. Please try again.');
					return;
				}

				const newSessionData = {
					...sessionData,
					senderId: currentUser.id,
					receiverId: receiverId,
					billingDetails: {
						...sessionData.billingDetails,
						basePrice: sessionData.billingDetails.dynamicBasePrice,
					},
					// Embed PSW's distance info if available (seeker -> PSW session)
					...(targetUserObj?.distanceInfo && { distanceInfo: targetUserObj.distanceInfo }),
				} as SessionDTO;

				console.log('📝 Creating session with distance info:', !!newSessionData.distanceInfo);
				
				await requestSession(newSessionData);
				
				router.push({
					pathname: '/sent-request',
					params: {
						otherUserId: receiverId,
					},
				});
			}
		} catch (error) {
			console.error('Error submitting session request:', error);
			alert('An error occurred while sending your request.');
		}
	};

	const originAddress = getLocationToDisplay();
	const pswIdForQuote = otherUserId as string;
	const quoteEnabled = Boolean(pswIdForQuote && originAddress && startDate && endDate);
	const { data: quote } = usePricingQuote(quoteEnabled, {
	  pswId: pswIdForQuote,
	  originAddress,
	  startTime: startDate?.toISOString(),
	  endTime: endDate?.toISOString()
	});

	const effectiveRate = quote?.hourlyRate ?? pswRate;
	const displayBasePrice = quote?.billing?.basePrice ?? basePrice;
	const displayTaxes = quote?.billing?.taxes ?? taxes;
	const displayServiceFee = quote?.billing?.serviceFee ?? serviceFee;
	const displayTotal = quote?.billing?.total ?? total;

	return (
		<SafeAreaView className="flex-1 bg-grey-0">
			{/* Custom Header */}
			<RequestSessionHeader
				onBack={() => router.back()}
				photoUrl={targetUserObj?.profilePhotoUrl || ''}
				firstName={targetUserObj?.firstName}
			/>
			<KeyboardAvoidingView 
				className="flex-1"
				behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
				keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
				enabled={true}
			>
				<ScrollView 
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps="handled"
					automaticallyAdjustKeyboardInsets={Platform.OS === 'ios'}
					bounces={false}
				>
				{/* Main Content */}
				<View className="flex-1 p-4">
					{/* Help Options Dropdown */}
					<HelpOptionsDropdown
						initialValue={helpText}
						onChange={setHelpText}
					/>

					{/* Care Recipient Selection - Only show if looking for family member */}
					{isLookingForFamily && currentUser?.familyMembers && currentUser.familyMembers.length > 0 && (
						<CareRecipientSelector
							familyMembers={currentUser.familyMembers}
							selectedRecipientId={selectedCareRecipient}
							onRecipientSelect={handleCareRecipientSelect}
						/>
					)}

					{/* Location Display - Only show if conditions are met */}
					{shouldShowLocation() && (
						<LocationDisplay 
							location={getLocationToDisplay()}
							label="Location"
						/>
					)}

					{/* Starts */}
					<DateTimeRow
						label="Starts"
						dateLabel={formatDate(startDate)}
						timeLabel={formatTime(startDate)}
						onPressDate={() => showDatePicker('start', 'date')}
						onPressTime={() => showDatePicker('start', 'time')}
						disabled={false}
					/>

					{/* Session Length */}
					<SessionLengthSelector
						sessionLength={sessionLength}
						formatSessionLength={formatSessionLength}
						incrementBy30={() => incrementSessionLength(0.5)}
						incrementBy60={() => incrementSessionLength(1)}
						onReset={() => setSessionLength(0)}
					/>

					{/* Conditionally render Ends only if startDate is set and sessionLength > 0 */}
					{startDate && sessionLength > 0 && (
						<DateTimeRow
							label="Ends"
							dateLabel={formatDate(endDate)}
							timeLabel={formatTime(endDate)}
							onPressDate={() => {}}
							onPressTime={() => {}}
							disabled={true}
						/>
					)}
					
					<SessionChecklist onChange={setChecklist} />

					{/* Billing Info */}
					<BillingCard
						basePrice={displayBasePrice}
						taxes={displayTaxes}
						serviceFee={displayServiceFee}
						total={displayTotal}
						hourlyRate={effectiveRate}
					/>


				</View>

				{/* DateTimePickerModal */}
				<DateTimePickerModal
					isVisible={isDatePickerVisible}
					mode={pickerMode}
					onConfirm={handleConfirm}
					onCancel={hideDatePicker}
					minuteInterval={15}
					minimumDate={
						pickerTarget === 'start'
							? startDate &&
								startDate.toDateString() !==
									new Date().toDateString()
								? new Date(
										startDate.getFullYear(),
										startDate.getMonth(),
										startDate.getDate(),
										0,
										0,
										0,
									)
								: new Date(Date.now() + 2 * 60 * 60 * 1000)
							: startDate || new Date()
					}
				/>
			</ScrollView>
			</KeyboardAvoidingView>

			<View className="bg-transparent">

			<View className="mx-4 bg-[#BBDAF7] flex-row py-3 px-4 items-start rounded-xl -translate-y-3">
				<Ionicons name="information-circle" size={38} color="#55A2EB" />
				<Text className="flex-1 text-[13px] text-grey-80 leading-[18px]">
					By sending this request, you agree to share this information with the caregiver. Learn more in our{' '}
					<PrivacyPolicyLink 
						textStyle={{ fontSize: 13, color: '#0c7ae2' }} 
						onPress={() => setShowPrivacyModal(true)}
					/>
				</Text>
			</View>
			
			{/* Submit Button - Fixed at bottom */}
			<TouchableOpacity
				onPress={handleSubmit}
				className="bg-brand-blue rounded-xl p-4 mx-4 items-center flex-row justify-center mb-4"
			>
				<Ionicons name="paper-plane" size={22} color="white"/>
				<Text className="text-white text-lg font-medium ml-3">
					{existingSession ? 'Update Session' : 'Send Request'}
				</Text>
			</TouchableOpacity>
			</View>
			
			<PrivacyPolicyModal 
				visible={showPrivacyModal} 
				onClose={() => setShowPrivacyModal(false)} 
			/>
		</SafeAreaView>
	);
};

export default RequestSession;
