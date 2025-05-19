// @/components/Profile/PendingSessionSlider.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { EnrichedSession } from '@/types/EnrichedSession';
import { formatDate, formatTimeRange } from '@/scripts/datetimeHelpers';
import { acceptSessionThunk, updateSessionStatus } from '@/redux/sessionSlice';
import { AppDispatch } from '@/redux/store';
import { useDispatch } from 'react-redux';
import { router } from 'expo-router';

interface PendingSessionSliderProps {
	session: EnrichedSession;
	onRequestChange?: () => void;
}

const PendingSessionSlider: React.FC<PendingSessionSliderProps> = ({
	session,
	onRequestChange,
}) => {
	const dispatch = useDispatch<AppDispatch>();

	// For "Accept" => set session to "pending"
	const handleAccept = async () => {
		try {
			await dispatch(acceptSessionThunk(session.id)).unwrap();
			router.back();
		} catch (err) {
			console.error('Error accepting session:', err);
		}
	};

	// For "Reject" => set session to "rejected"
	const handleReject = async () => {
		try {
			await dispatch(
				updateSessionStatus({
					sessionId: session.id,
					newStatus: 'rejected',
				}),
			).unwrap();
			router.back();
		} catch (err) {
			console.error('Error rejecting session:', err);
		}
	};
	// Use the note attribute as the session title (fallback if empty)
	const note = session.note ?? 'Appointment';
	// Get the total cost from billing details (if available)
	const totalCost = session.billingDetails?.total?.toFixed(2) ?? 'N/A';

	// Format the start date using the provided formatDate function.
	const dateLabel = session.startTime
		? formatDate(session.startTime)
		: 'Invalid Date';
	// Format the time range using the provided formatTimeRange function.
	const timeRange =
		session.startTime && session.endTime
			? formatTimeRange(session.startTime, session.endTime)
			: 'Invalid Time';

	// Check if the end time is on a later day than the start time.
	const startDate = session.startTime ? new Date(session.startTime) : null;
	const endDate = session.endTime ? new Date(session.endTime) : null;
	const isNextDay =
		startDate && endDate
			? endDate.getDate() !== startDate.getDate()
			: false;

	return (
		<View
			className="absolute bottom-0 left-0 right-0"
			style={{
				borderTopLeftRadius: 20,
				borderTopRightRadius: 20,
				overflow: 'hidden',
				elevation: 8,
				shadowColor: '#000',
				shadowOffset: { width: 0, height: -2 },
				shadowOpacity: 0.1,
				shadowRadius: 6,
			}}
		>
			<LinearGradient
				start={{ x: 0, y: 0.5 }}
				end={{ x: 1, y: 0.5 }}
				colors={['#008DF4', '#5CBAFF']}
				className="py-4 px-4 pb-8"
			>
				{/* Session Title */}
				<Text className="text-base text-white mb-3">
					Session Request: {note}
				</Text>

				{/* Date/Time Card */}
				<View
					className="flex-row items-center justify-center rounded-lg py-2 mb-4 bg-transparent border"
					style={{ borderColor: '#ffffff', width: '100%' }}
				>
					<View className="flex-1 flex-row items-center justify-center">
						<Ionicons name="calendar" size={18} color="#ffffff" />
						<Text className="text-sm text-white ml-2">
							{dateLabel}
						</Text>
						<Text className="text-xs text-green-400 ml-2">{`${isNextDay ? '+1' : ''}`}</Text>
					</View>
					<View
						style={{
							width: 1,
							height: 28,
							backgroundColor: 'rgba(255,255,255,0.5)',
						}}
					/>
					<View className="flex-1 flex-row items-center justify-center">
						<Ionicons name="time" size={18} color="#ffffff" />
						<Text className="text-sm text-white ml-2">
							{timeRange}
						</Text>
					</View>
				</View>

				{/* Accept / Reject Buttons */}
				<View className="flex-row items-center justify-between mb-4">
					<TouchableOpacity
						onPress={handleAccept}
						activeOpacity={0.8}
						className="bg-white px-6 py-3 rounded-lg"
						style={{ width: '48%' }}
					>
						<Text className="text-black text-sm text-center">
							Accept
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={handleReject}
						activeOpacity={0.8}
						className="bg-black px-6 py-3 rounded-lg"
						style={{ width: '48%' }}
					>
						<Text className="text-white text-sm text-center">
							Reject
						</Text>
					</TouchableOpacity>
				</View>

				{/* Status & Total Cost Row */}
				<View className="flex-row items-center justify-between mb-3">
					<Text className="text-xs text-white">
						Awaiting confirmation
					</Text>
					<Text className="text-xs text-white">
						Total: <Text className="font-medium">${totalCost}</Text>
					</Text>
				</View>

				{/* Request Date/Time Change Button */}
				<TouchableOpacity
					onPress={onRequestChange}
					activeOpacity={0.8}
					className="border border-white px-5 py-2 items-center rounded-lg"
				>
					<Text className="text-white text-sm">
						Request Date/Time Change
					</Text>
				</TouchableOpacity>
			</LinearGradient>
		</View>
	);
};

export default PendingSessionSlider;
