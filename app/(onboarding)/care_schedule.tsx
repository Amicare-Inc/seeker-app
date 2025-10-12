import React, { useState } from 'react';
import { PrivacyPolicyLink, PrivacyPolicyModal } from '@/features/privacy';
import { TermsOfUseLink, TermsOfUseModal } from '@/features/privacy/components/TermsOfUseModal';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CustomButton } from '@/shared/components';
import { useAvailability } from '@/features/availability';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { setTempAvailability, setTempFamilyMember } from '@/redux/userSlice';

const days = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
const timeslots = [
	'10 am - 12 pm',
	'12 pm - 2 pm',
	'2 pm - 4 pm',
	'4 pm - 6 pm',
	'6 pm - 8 pm',
	'8 pm - 10 pm'
];

const CareSchedule: React.FC = () => {
	const [showPrivacyModal, setShowPrivacyModal] = useState(false);
	const [showTermsModal, setShowTermsModal] = useState(false);
	const dispatch = useDispatch<AppDispatch>();
	const userData = useSelector((state: RootState) => state.user.userData);
	const tempFamilyMember = useSelector((state: RootState) => state.user.tempFamilyMember);
	const {
		availability,
		addTimeSlot,
		clearDay,
		clearAll,
		saveAvailability,
	} = useAvailability();
	
	// Local state to track UI interactions
	const [activeDay, setActiveDay] = useState<string | null>(null);
	
	// Initialize local state with existing availability data
	const initializeLocalSlots = () => {
		const safeAvailability = (availability && typeof availability === 'object') ? availability : {};
		const localSlots: {[day: string]: string[]} = {};
		const safeEntries = (obj: any) => obj && typeof obj === 'object' ? Object.entries(obj) : [];
		safeEntries(safeAvailability).forEach(([day, daySlots]) => {
			const safeDaySlots = Array.isArray(daySlots) ? daySlots : [];
			localSlots[day] = [];
			safeDaySlots.forEach(slot => {
				if (!slot || typeof slot !== 'object') return;
				safeEntries(timeSlotMap).forEach(([timeString, timeRangeRaw]) => {
					const timeRange = timeRangeRaw as { start: string; end: string };
					if (timeRange && timeRange.start === slot.start && timeRange.end === slot.end) {
						localSlots[day].push(timeString);
					}
				});
			});
		});
		return localSlots;
	};
	
	const [localSelectedSlots, setLocalSelectedSlots] = useState<{[day: string]: string[]}>(initializeLocalSlots);
	
	// Convert timeslot strings to start/end times
	const timeSlotMap: { [key: string]: { start: string; end: string } } = {
		'8 am - 10 am': { start: '08:00', end: '10:00' },
		'10 am - 12 pm': { start: '10:00', end: '12:00' },
		'12 pm - 2 pm': { start: '12:00', end: '14:00' },
		'2 pm - 4 pm': { start: '14:00', end: '16:00' },
		'4 pm - 6 pm': { start: '16:00', end: '18:00' },
		'6 pm - 8 pm': { start: '18:00', end: '20:00' },
	};
	
	// Day name mapping for Firebase (convert short to full names)
	const dayNameMap: { [key: string]: string } = {
		Mon: 'Monday',
		Tues: 'Tuesday',
		Wed: 'Wednesday',
		Thurs: 'Thursday',
		Fri: 'Friday',
		Sat: 'Saturday',
		Sun: 'Sunday'
	};
	
	// Helper function to check if a time slot is selected for a day (using local state)
	const isTimeSlotSelected = (day: string, timeString: string): boolean => {
		return (localSelectedSlots[day] || []).includes(timeString);
	};
	
	// Helper function to get all selected time slots for a day
	const getSelectedTimeSlotsForDay = (day: string): string[] => {
		return localSelectedSlots[day] || [];
	};
	
	const toggleDay = (day: string) => {
		setActiveDay(activeDay === day ? null : day);
	};
	
	const toggleTime = (timeString: string) => {
		if (!activeDay) return;
		
		setLocalSelectedSlots(prev => {
			const daySlots = prev[activeDay] || [];
			const isSelected = daySlots.includes(timeString);
			
			if (isSelected) {
				// Remove the time slot
				return {
					...prev,
					[activeDay]: daySlots.filter(slot => slot !== timeString)
				};
			} else {
				// Add the time slot
				return {
					...prev,
					[activeDay]: [...daySlots, timeString]
				};
			}
		});
	};
	
	const resetAvailability = () => {
		clearAll();
		setActiveDay(null);
		setLocalSelectedSlots({});
	};
	
	const handleNext = () => {
		// Navigate based on user type - same logic as useAvailability hook
		const { isPsw, lookingForSelf } = userData || {};
		
		if (isPsw) {
			// PSWs go to personal details (their provider flow)
			router.push('/personal_details');
		} else if (lookingForSelf === false) {
			// Family care seeker - go to about loved one
			router.push('/about_loved_one');
		} else {
			// Self-care seeker - go to personal details
			router.push('/personal_details');
		}
	};
	
	// Helper function to convert time string to minutes since midnight
	const timeToMinutes = (time: string): number => {
		const [hours, minutes] = time.split(':').map(Number);
		return hours * 60 + minutes;
	};

	// Helper function to convert minutes to time string
	const minutesToTime = (minutes: number): string => {
		const hours = Math.floor(minutes / 60);
		const mins = minutes % 60;
		return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
	};

	// Merge overlapping intervals
	const mergeIntervals = (intervals: { start: string; end: string }[]): { start: string; end: string }[] => {
		if (intervals.length <= 1) return intervals;

		// Convert to minutes, sort by start time
		const minuteIntervals = intervals
			.map(interval => ({
				start: timeToMinutes(interval.start),
				end: timeToMinutes(interval.end)
			}))
			.sort((a, b) => a.start - b.start);

		const merged = [minuteIntervals[0]];

		for (let i = 1; i < minuteIntervals.length; i++) {
			const current = minuteIntervals[i];
			const lastMerged = merged[merged.length - 1];

			// If current interval overlaps or touches the last merged interval
			if (current.start <= lastMerged.end) {
				lastMerged.end = Math.max(lastMerged.end, current.end);
			} else {
				merged.push(current);
			}
		}

		// Convert back to time strings
		return merged.map(interval => ({
			start: minutesToTime(interval.start),
			end: minutesToTime(interval.end)
		}));
	};

	// Sync local state with hook before saving
	const syncAndSave = () => {
		// Convert local selected slots to hook format with full day names for Firebase
		const convertedAvailability: { [day: string]: { start: string; end: string }[] } = {};
		
		Object.entries(localSelectedSlots).forEach(([shortDay, timeStrings]) => {
			const daySlots: { start: string; end: string }[] = [];
			timeStrings.forEach(timeString => {
				const timeRange = timeSlotMap[timeString];
				if (timeRange) {
					daySlots.push({
						start: timeRange.start,
						end: timeRange.end
					});
				}
			});
			
			// Merge overlapping intervals for this day
			const mergedSlots = mergeIntervals(daySlots);
			
			// Convert short day name to full day name for Firebase
			const fullDayName = dayNameMap[shortDay] || shortDay;
			convertedAvailability[fullDayName] = mergedSlots;
		});
		
		console.log('Saving availability to Redux (merged with full day names):', convertedAvailability);
		
		// Check if this is family care or self care
		const isFamily = userData?.lookingForSelf === false;
		
		if (isFamily) {
			// Save availability to family member
			const updatedFamilyMember = {
				...tempFamilyMember,
				carePreferences: {
					...tempFamilyMember?.carePreferences,
					availability: convertedAvailability,
				}
			};
			console.log('Saving availability to tempFamilyMember (family care):', convertedAvailability);
			dispatch(setTempFamilyMember(updatedFamilyMember));
		} else {
			// Save availability to core user (self care) 
			dispatch(setTempAvailability(convertedAvailability));
			console.log('Saving availability to tempAvailability (self care):', convertedAvailability);
		}
	};

	return (
		<SafeAreaView 
			className="flex-1 bg-grey-0" 
		>
			<ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
				<View className="px-[16px]">
					{/* Header */}
					<View className="flex-row items-center mb-[20px]">
						<TouchableOpacity className="absolute" onPress={() => router.back()}>
							<Ionicons name="chevron-back" size={24} color="#000" />
						</TouchableOpacity>
						<Text className="text-xl font-semibold mx-auto">
							3/3 Care Schedule
							{/* should be 3/4 in future */}
						</Text>
					</View>

					{/* Question */}
					<Text className="text-lg text-grey-80 mb-[20px]">
						On which days do you usually need care?{'\n'}Select all that apply:
					</Text>

					{/* Day Selection */}
					<View className="flex-wrap flex-row mb-[10px] justify-between">
						{days.map((day) => {
							const hasTimeSlots = getSelectedTimeSlotsForDay(day).length > 0;
							const isActiveDay = activeDay === day;
							const isWeekend = day === 'Sat' || day === 'Sun';
							
							// Determine button styling based on state
							let bgColor = 'bg-white';
							let textColor = 'text-black';
							
							if (isWeekend) {
								// Weekend days - disabled grey
								bgColor = 'bg-white';
								textColor = 'text-grey-35';
							} else if (isActiveDay) {
								// Currently selected day - full blue
								bgColor = 'bg-brand-blue';
								textColor = 'text-white';
							} else if (hasTimeSlots) {
								// Days with time slots but not currently active - lighter blue
								bgColor = 'bg-[#72B2EE]';
								textColor = 'text-white';
							}
							
							return (
								<CustomButton
									key={day}
									title={day}
									handlePress={isWeekend ? () => {} : () => toggleDay(day)}
									containerStyles={`w-[82px] h-[44px] rounded-full mb-[10px] min-h-[44px] ${bgColor}`}
									textStyles={`text-sm font-medium ${textColor}`}
								/>
							);
						})}
						<CustomButton
							title="Reset"
							handlePress={resetAvailability}
							containerStyles="w-[82px] h-[44px] rounded-full min-h-[44px] bg-white"
							textStyles="text-sm font-medium text-black"
						/>
					</View>

					<Text className="mb-[20px] text-grey-49 text-xs px-1">Care on weekends (Sat/Sun) is currently unavailable during our beta phase.</Text>

					{/* Time Slot Selection */}
					{activeDay && (
						<View className="">
							<Text className="text-lg text-grey-80 mb-[20px]">
								At roughly what times on{' '}
								<Text className="font-bold">
									{activeDay ? dayNameMap[activeDay] || activeDay : ''}
								</Text>{' '}
								do you need care? Select all that apply:
							</Text>
							<View className="flex-wrap flex-row justify-between">
								{(() => {
									const leftColumn: string[] = [];
									const rightColumn: string[] = [];
									timeslots.forEach((time, idx) => {
										(idx % 2 === 0 ? leftColumn : rightColumn).push(time);
									});
									return (
										<>
											<View className="flex-1 mr-[5px]">
												{leftColumn.map((time) => (
													<CustomButton
														key={time}
														title={time}
														handlePress={() => toggleTime(time)}
														containerStyles={`mb-[10px] rounded-full w-full h-[44px] min-h-[44px] ${
															activeDay && isTimeSlotSelected(activeDay, time)
																? 'bg-brand-blue'
																: 'bg-white'
														}`}
														textStyles={`text-sm font-medium ${
															activeDay && isTimeSlotSelected(activeDay, time)
																? 'text-white'
																: 'text-black'
														}`}
													/>
												))}
											</View>
											<View className="flex-1 ml-[5px]">
												{rightColumn.map((time) => (
													<CustomButton
														key={time}
														title={time}
														handlePress={() => toggleTime(time)}
														containerStyles={`mb-[10px] rounded-full w-full h-[44px] min-h-[44px] ${
															activeDay && isTimeSlotSelected(activeDay, time)
																? 'bg-brand-blue'
																: 'bg-white'
														}`}
														textStyles={`text-sm font-medium ${
															activeDay && isTimeSlotSelected(activeDay, time)
																? 'text-white'
																: 'text-black'
														}`}
													/>
												))}
											</View>
										</>
										
									);
								})()}
							</View>
							<Text className="mt-[10px] text-grey-49 text-xs px-1">Our time range during beta will be between 10 am to 10 pm.</Text>
						</View>
						
					)}

				</View>
			</ScrollView>

			{/* Update Button */}
			<View className="px-[16px]">
				<View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 21 }}>
					<Ionicons
						name="information-circle"
						size={30}
						color="#BFBFC3"
						style={{ marginRight: 8, marginTop: 2 }}
					/>
					<Text style={{ flex: 1, fontSize: 12, color: '#7B7B7E', lineHeight: 16, fontWeight: '500' }}>
						We use your care preferences to personalize your match. This info is confidential and only shared with your consent. By continuing, you agree to our{' '}
						<PrivacyPolicyLink onPress={() => setShowPrivacyModal(true)} textStyle={{ color: '#0c7ae2' }} /> and <TermsOfUseLink onPress={() => setShowTermsModal(true)} textStyle={{ color: '#0c7ae2' }} />.
					</Text>
				</View>
				<CustomButton
					title="Update"
					handlePress={() => {
						syncAndSave();
						handleNext();
					}}
					containerStyles="bg-black py-4 rounded-lg mb-2"
					textStyles="text-white text-xl font-medium"
				/>
				<PrivacyPolicyModal
					visible={showPrivacyModal}
					onClose={() => setShowPrivacyModal(false)}
				/>
				<TermsOfUseModal
					visible={showTermsModal}
					onClose={() => setShowTermsModal(false)}
				/>
			</View>
		</SafeAreaView>
	);
};

export default CareSchedule;
