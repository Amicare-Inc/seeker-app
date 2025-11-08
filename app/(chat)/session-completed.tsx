import React, { useEffect, useState } from 'react';
import { SafeAreaView, View, Text, Image, TouchableOpacity, ActivityIndicator, Alert, TextInput, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useSessionCompletion } from '@/lib/context/SessionCompletionContext';
import { getSessionDisplayInfo } from '@/features/sessions/utils/sessionDisplayUtils';
import { useEnrichedSessions } from '@/features/sessions/api/queries';
import { useActiveSession } from '@/lib/context/ActiveSessionContext';
import { getAuthHeaders } from '@/lib/auth';
import StarRating from '@/features/common/StarRating';

const SessionCompleted = () => {
	const { sessionId } = useLocalSearchParams();
	const currentUser = useSelector((state: RootState) => state.user.userData);

	// Local UI state (guarded to avoid crashes if optional features are not wired)
	const [showReportInput, setShowReportInput] = useState(false);
	const [reportText, setReportText] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [hasRated, setHasRated] = useState(false);
	const [userRating, setUserRating] = useState(5);
	const [isSubmittingRating, setIsSubmittingRating] = useState(false);

	// Context data
	const { completedSession, clearCompletedSession } = useSessionCompletion();
	// Active session context (may still hold the session)
	const { activeEnrichedSession } = useActiveSession();
	// React Query cache / network fallback
	const { data: allSessions = [], isFetching } = useEnrichedSessions(currentUser?.id);

	// Determine session data using priority order
	const sessionData = completedSession || activeEnrichedSession || allSessions.find(s => s.id === sessionId);

	// Clean up context when component unmounts (user navigates away)
	useEffect(() => {
		return () => {
			clearCompletedSession();
		};
	}, [clearCompletedSession]);

	// Loading state if we still don't have session and query is fetching
	if (!sessionData && isFetching) {
		return (
			<SafeAreaView className="flex-1 justify-center items-center bg-white">
				<ActivityIndicator size="large" color="#6B7280" />
				<Text className="text-sm text-gray-600 mt-4">Loading session details...</Text>
			</SafeAreaView>
		);
	}

	// Error fallback component
	const ErrorFallback = ({ message = "Session data not available" }: { message?: string }) => (
		<SafeAreaView className="flex-1 justify-center items-center bg-white px-4">
			<Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
			<Text className="text-lg font-semibold text-gray-800 mt-4 text-center">
				{message}
			</Text>
			<TouchableOpacity
				onPress={() => {
					clearCompletedSession();
					if (currentUser?.isPsw) {
                        router.replace('/(dashboard)/(psw)/psw-sessions');
					} else {
						router.replace('/(dashboard)/(seeker)/seeker-home');
					}
				}}
				className="bg-blue-500 rounded-lg px-6 py-3 mt-4"
			>
				<Text className="text-white font-semibold text-center">
					Go to Dashboard
				</Text>
			</TouchableOpacity>
		</SafeAreaView>
	);

	// Validate required data
	if (!sessionData || !currentUser) {
		console.warn('Session completion page: Missing session data or user data', {
			hasSessionData: !!sessionData,
			hasCurrentUser: !!currentUser,
			sessionId,
		});
		return <ErrorFallback message="Session completion data not available" />;
	}

	// Validate session ID matches (extra safety check)
	if (sessionData.id !== sessionId) {
		console.warn('Session completion page: Session ID mismatch', {
			contextSessionId: sessionData.id,
			paramsSessionId: sessionId,
		});
		return <ErrorFallback message="Session data mismatch" />;
	}

	// If we have session but no otherUser, show completion without user details
	if (!sessionData.otherUser) {
		return (
			<SafeAreaView className="flex-1 justify-center items-center bg-white px-4">
				<Ionicons name="checkmark-circle" size={48} color="#22C55E" />
				<Text className="text-xl font-bold text-gray-800 mt-4 text-center">
					Session Completed!
				</Text>
				<Text className="text-base text-gray-600 mt-2 text-center">
					Your session has been completed successfully.
				</Text>
				<TouchableOpacity
					onPress={() => {
						clearCompletedSession();
						if (currentUser?.isPsw) {
                            router.replace('/(dashboard)/(psw)/psw-sessions');
						} else {
							router.replace('/(dashboard)/(seeker)/seeker-home');
						}
					}}
					className="bg-blue-500 rounded-lg px-6 py-3 mt-6"
				>
					<Text className="text-white font-semibold text-center">
						Go to Dashboard
					</Text>
				</TouchableOpacity>
			</SafeAreaView>
		);
	}

	const otherUser = sessionData.otherUser;
	const displayInfo = getSessionDisplayInfo(sessionData, currentUser);
	const isForFamilyMember = sessionData.isForFamilyMember;
	const careRecipient = sessionData.careRecipient;
	const accountHolder = sessionData.otherUser;
	
	const onReportPress = () => {
		setShowReportInput(true);
	};

	const submitReport = async () => {
		console.log('🔄 Submit report called');
		console.log('Report text:', reportText);
		console.log('Current user:', currentUser);
		console.log('Session ID:', sessionId);

		if (!reportText.trim()) {
			Alert.alert('Error', 'Please enter a description of the issue');
			return;
		}

		if (!currentUser?.id) {
			Alert.alert('Error', 'User information not available. Please log in again.');
			return;
		}

		if (!sessionId) {
			Alert.alert('Error', 'Session information not available');
			return;
		}
		
		setIsSubmitting(true);
		try {
			const { submitSessionFeedback } = await import('@/features/sessions/api/sessionApi');
			await submitSessionFeedback(sessionId as string, currentUser.id, 'issue_report', reportText);
			Alert.alert('Report Submitted', 'Thank you for your feedback.');
			setShowReportInput(false);
			setReportText('');
		} catch (error: any) {
			Alert.alert('Error', error?.message || 'Network error. Please try again.');
		} finally {
			setIsSubmitting(false);
		}
	};

	const cancelReport = () => {
		setShowReportInput(false);
		setReportText('');
		Keyboard.dismiss();
	};

	const handleSubmitEditing = () => {
		Keyboard.dismiss();
	};

	const goToDashboard = () => {
		clearCompletedSession(); // Clean up context
		if (currentUser.isPsw) {
            router.replace('/(dashboard)/(psw)/psw-sessions');
		} else {
			router.replace('/(dashboard)/(seeker)/seeker-home');
		}
	};

	const submitRating = async () => {
		if (!sessionData || !currentUser || hasRated) return;
		setIsSubmittingRating(true);
		try {
			const headers = await getAuthHeaders();
			await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${sessionId}/rate`, {
				method: 'POST',
				headers,
				body: JSON.stringify({
					ratedUserId: sessionData.otherUser?.id,
					rating: userRating
				})
			});
			setHasRated(true);
		} catch (error) {
			console.error('Error submitting rating:', error);
		} finally {
			setIsSubmittingRating(false);
		}
	};

	const skipRating = async () => {
		if (!sessionData || !currentUser || hasRated) return;
		setIsSubmittingRating(true);
		try {
			const headers = await getAuthHeaders();
			await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/sessions/${sessionId}/rate`, {
				method: 'POST',
				headers,
				body: JSON.stringify({
					ratedUserId: sessionData.otherUser?.id,
					rating: 5
				})
			});
			setHasRated(true);
		} catch (error) {
			console.error('Error submitting rating:', error);
		} finally {
			setIsSubmittingRating(false);
		}
	};

	return (
		<KeyboardAvoidingView
			behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
			style={{ flex: 1 }}
			keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
		>
			<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
				<SafeAreaView className="flex-1 bg-white">
			{/* Main Content */}
			<View className="flex-1 justify-center items-center px-4">
				{/* Profile Photo(s) */}
				<View className="mb-6 relative">
					{/* Show dual photos for PSWs viewing family member sessions */}
					{currentUser.isPsw && isForFamilyMember && careRecipient && accountHolder ? (
						<View className="relative">
							{/* Core user photo (behind) */}
							<Image
								source={
									accountHolder.profilePhotoUrl
										? { uri: accountHolder.profilePhotoUrl }
										: require('@/assets/default-profile.png')
								}
								className="w-36 h-36 rounded-full absolute"
								style={{ right: -40 }}
							/>
							{/* Family member photo (in front) */}
							<Image
								source={
									careRecipient.profilePhotoUrl
										? { uri: careRecipient.profilePhotoUrl }
										: require('@/assets/default-profile.png')
								}
								className="w-36 h-36 rounded-full border-4 border-white"
							/>
						</View>
					) : (
						/* Single profile photo */
						<Image
							source={
								displayInfo.primaryPhoto
									? { uri: displayInfo.primaryPhoto }
									: require('@/assets/default-profile.png')
							}
							className="w-36 h-36 rounded-full"
						/>
					)}
				</View>

				{/* Success Icon and Header */}
				<View className="flex-row items-center mb-4">
					<Ionicons
						name="checkmark-circle"
						size={40}
						color="#22C55E"
					/>
					<Text className="text-2xl font-bold ml-3 text-gray-800">
						Session Completed
					</Text>
				</View>

				{/* Message */}
				<Text className="text-base text-gray-600 text-center mb-8 px-4 leading-6">
					Your session with {displayInfo.primaryName.split(' ')[0]} has been completed successfully. 
					{currentUser.isPsw 
						? ' Payment has been processed to your account.'
						: ' Thank you for using Amicare.'
					}
				</Text>

				{/* Rating */}
				{!hasRated && sessionData?.otherUser && (
					<View className="w-full mb-8 p-6 bg-gray-50 rounded-xl">
						<Text className="text-lg font-semibold text-center mb-4">
							How was your experience with {(sessionData as any)?.otherUser?.firstName || 'the provider'}?
						</Text>
						<StarRating rating={userRating} onRatingChange={setUserRating} size={40} />
						<View className="flex-row mt-6 space-x-4">
							<TouchableOpacity
								onPress={submitRating}
								disabled={isSubmittingRating}
								className="flex-1 bg-blue-500 rounded-lg py-3"
							>
								<Text className="text-white font-semibold text-center">
									{isSubmittingRating ? 'Submitting...' : 'Submit Rating'}
								</Text>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={skipRating}
								disabled={isSubmittingRating}
								className="flex-1 bg-gray-300 rounded-lg py-3"
							>
								<Text className="text-gray-700 font-semibold text-center">Skip</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}

				{hasRated && (
					<View className="mb-6">
						<Text className="text-green-600 font-medium text-center">
							Thank you for your feedback!
						</Text>
					</View>
				)}

				{/* Action Buttons */}
				<View className="w-full px-4 space-y-3">
					{/* Dashboard Button */}
					<TouchableOpacity
						onPress={goToDashboard}
						className="bg-brand-blue rounded-xl p-4 items-center flex-row justify-center"
					>
						<Ionicons name="home" size={22} color="white" />
						<Text className="text-white text-lg font-medium ml-3">
							Go to Dashboard
						</Text>
					</TouchableOpacity>

					{/* Report Issue Button or Input */}
					{!showReportInput ? (
						<TouchableOpacity
							onPress={onReportPress}
							className="bg-gray-100 rounded-xl p-4 items-center flex-row justify-center"
						>
							<Ionicons name="flag" size={22} color="#6B7280" />
							<Text className="text-gray-700 text-lg font-medium ml-3">
								Report an Issue
							</Text>
						</TouchableOpacity>
					) : (
						<View className="bg-white rounded-xl p-4 border border-gray-300">
							<Text className="text-gray-800 font-medium mb-2">
								What issue would you like to report?
							</Text>
							<TextInput
								value={reportText}
								onChangeText={setReportText}
								placeholder="Describe the issue you experienced..."
								multiline
								className="bg-gray-100 rounded-lg p-3 min-h-[100px] text-gray-800 mb-3"
								textAlignVertical="top"
								returnKeyType="done"
								onSubmitEditing={handleSubmitEditing}
								blurOnSubmit={true}
							/>
							<View className="flex-row justify-end space-x-3">
								<TouchableOpacity
									onPress={cancelReport}
									disabled={isSubmitting}
									className="px-4 py-2 rounded-lg bg-gray-200"
								>
									<Text className="text-gray-700 font-medium">Cancel</Text>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={submitReport}
									disabled={isSubmitting || !reportText.trim()}
									className={`px-4 py-2 rounded-lg ${
										isSubmitting || !reportText.trim() 
											? 'bg-gray-400' 
											: 'bg-brand-blue'
									}`}
								>
									{isSubmitting ? (
										<ActivityIndicator size="small" color="white" />
									) : (
										<Text className="text-white font-medium">Submit</Text>
									)}
								</TouchableOpacity>
							</View>
						</View>
					)}
				</View>
			</View>
			</SafeAreaView>
			</TouchableWithoutFeedback>
		</KeyboardAvoidingView>
	);
};

export default SessionCompleted;