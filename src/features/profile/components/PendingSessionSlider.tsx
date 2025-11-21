import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { EnrichedSession } from '@/types/EnrichedSession';
import { formatDate, formatTimeRange } from '@/lib/datetimes/datetimeHelpers';
import { useAcceptSession, useRejectSession } from '@/features/sessions/api/queries';
import { router } from 'expo-router';

interface PendingSessionSliderProps {
	session: EnrichedSession;
	onRequestChange?: () => void;
}

const PendingSessionSlider: React.FC<PendingSessionSliderProps> = ({
	session,
	onRequestChange,
}) => {
	const currentUser = useSelector((state: RootState) => state.user.userData);
	const acceptSessionMutation = useAcceptSession();
	const rejectSessionMutation = useRejectSession();

	const handleAccept = async () => {
		try {
			await acceptSessionMutation.mutateAsync(session.id);
			router.back();
		} catch (err) {
			console.error('Error accepting session:', err);
		}
	};

	const handleReject = async () => {
		try {
			await rejectSessionMutation.mutateAsync(session.id);
			router.back();
		} catch (err) {
			console.error('Error rejecting session:', err);
		}
	};

	const note = session.note ?? 'Appointment';
	const totalCost = session.billingDetails?.total?.toFixed(2) ?? 'N/A';

	const dateLabel = session.startTime
		? formatDate(session.startTime)
		: 'Invalid Date';

	const timeRange =
		session.startTime && session.endTime
			? formatTimeRange(session.startTime, session.endTime)
			: 'Invalid Time';

	const startDate = session.startTime ? new Date(session.startTime) : null;
	const endDate = session.endTime ? new Date(session.endTime) : null;
	const isNextDay =
		startDate && endDate
			? endDate.getDate() !== startDate.getDate()
			: false;

	// Determine the pending message based on user type
	const getPendingMessage = () => {

		// Core seeker sees message about PSW
		const pswName = session.otherUser?.firstName || 'PSW';
		return `Awaiting final booking from ${pswName}. Feel free to message them if you need any changes`;
	
	};

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
			{/* Grey gradient for pending state */}
			<LinearGradient
				start={{ x: 0, y: 0.5 }}
				end={{ x: 1, y: 0.5 }}
				colors={['#9CA3AF', '#D1D5DB']}
				className="py-4 px-4 pb-8"
			>
				{/* Response Status with Yellow Exclamation */}
				<View className="flex-row items-center mb-3">
					<Ionicons name="warning" size={20} color="#F59E0B" />
					<Text className="text-base text-white ml-2 font-medium">
						Response Sent: Awaiting final booking
					</Text>
				</View>

				{/* Date/Time Card */}
				<View
					className="flex-row items-center justify-center rounded-lg py-2 mb-4 bg-white"
					style={{ width: '100%' }}
				>
					<View className="flex-1 flex-row items-center justify-center">
						<Ionicons name="calendar" size={18} color="#374151" />
						<Text className="text-sm text-gray-700 ml-2">
							{dateLabel}
						</Text>
						<Text className="text-xs text-green-600 ml-2">{`${isNextDay ? '+1' : ''}`}</Text>
					</View>
					<View
						style={{
							width: 1,
							height: 28,
							backgroundColor: '#E5E7EB',
						}}
					/>
					<View className="flex-1 flex-row items-center justify-center">
						<Ionicons name="time" size={18} color="#374151" />
						<Text className="text-sm text-gray-700 ml-2">
							{timeRange}
						</Text>
					</View>
				</View>

				{/* Session Checklist */}
				<View className="mb-4">
					<Text className="text-white text-base font-medium mb-2">Session Checklist</Text>
					{session.checklist?.map((item, index) => (
						<Text key={index} className="text-white text-sm mb-1">
							{index + 1}. {item.task}
						</Text>
					))}
				</View>

				{/* Chat Unlocked & Distance Info */}
				<View className="flex-row items-center justify-between mb-4">
					<View className="flex-row items-center">
						<Ionicons name="checkmark-circle" size={20} color="#10B981" />
						<Text className="text-white text-sm ml-2">Chat unlocked</Text>
					</View>
					<View className="flex-row items-center">
						<Text className="text-white text-sm font-medium">
							Total: ${totalCost}
						</Text>
						
					</View>
				</View>

				{/* Pending Message */}
				<View className="flex-row items-start mb-4 bg-yellow-100 rounded-lg p-3">
					<Ionicons name="warning" size={20} color="#F59E0B" style={{ marginTop: 2 }} />
					<Text className="text-yellow-800 text-sm ml-2 flex-1">
						{getPendingMessage()}
					</Text>
				</View>

				{/* Action Buttons */}
				<View className="flex-row items-center justify-between">
					<TouchableOpacity
						onPress={() => router.back()}
						activeOpacity={0.8}
						className="bg-white px-6 py-3 rounded-lg"
						style={{ width: '48%' }}
					>
						<Text className="text-black text-sm text-center font-medium">
							Back
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						onPress={onRequestChange}
						activeOpacity={0.8}
						className="bg-black px-6 py-3 rounded-lg"
						style={{ width: '48%' }}
					>
						<Text className="text-white text-sm text-center font-medium">
							Change/Cancel
						</Text>
					</TouchableOpacity>
				</View>
			</LinearGradient>
		</View>
	);
};

export default PendingSessionSlider;
