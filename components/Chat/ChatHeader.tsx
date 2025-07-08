// src/components/Chat/ChatHeader.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { User } from '@/types/User';
import { EnrichedSession } from '@/types/EnrichedSession';
import { useChatHeader } from './useChatHeader';
import { router } from 'expo-router';
import { SessionStatus } from '@/constants/enums';
import { BTN_BASE, BTN_PRIMARY, BTN_OUTLINE_BLACK, BTN_OUTLINE_WHITE } from '@/shared/styles';

interface ChatHeaderProps {
	session: EnrichedSession;
	user: User;
	isExpanded: boolean;
	toggleExpanded: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
	session,
	user,
	isExpanded,
	toggleExpanded,
}) => {
	const {
		currentSession,
		isConfirmed,
		isUserConfirmed,
		isDisabled,
		bookText,
		subTitle,
		formattedDate,
		formattedTimeRange,
		isNextDay,
		costLabel,
		handleBookSession,
		handleCancelSession,
		handleNavigateToRequestSession,
		handleNavigateToUserProfile,
	} = useChatHeader({ session, user });

	return (
		<LinearGradient
			start={{ x: 0, y: 0.5 }}
			end={{ x: 1, y: 0.5 }}
			colors={
				currentSession.status === SessionStatus.InProgress 
					? ['#05a73c', '#4ade80']  // Matching the parent gradient
					: isConfirmed 
						? ['#008DF4', '#5CBAFF']  // Blue gradient for confirmed
						: ['#ffffff', '#ffffff']   // White for other states
			}
		>
			{/* Top row */}
			<View className="flex-row items-center px-4 pb-3">
				<TouchableOpacity
					onPress={() => router.back()}
					className="mr-3"
				>
					<Feather
						name="chevron-left"
						size={24}
						color={currentSession.status === SessionStatus.InProgress ? 'black' : (isConfirmed ? '#fff' : '#000')}
					/>
				</TouchableOpacity>
				<Image
					source={{
						uri:
							user.profilePhotoUrl ||
							'https://via.placeholder.com/50',
					}}
					className="w-14 h-14 rounded-full mr-3"
				/>
				<TouchableOpacity onPress={toggleExpanded} className="flex-1">
					<Text
						className={`font-semibold text-lg ${currentSession.status === SessionStatus.InProgress ? 'text-black' : (isConfirmed ? 'text-white' : 'text-black')}`}
					>
						{user.firstName} {user.lastName}
					</Text>
					<Text
						className={`text-xs mt-0.5 ${currentSession.status === SessionStatus.InProgress ? 'text-black' : (isConfirmed ? 'text-white' : 'text-gray-500')}`}
					>
						{subTitle}
					</Text>
				</TouchableOpacity>
				{isExpanded && (
					<TouchableOpacity onPress={handleNavigateToUserProfile}>
						<Feather
							name="info"
							size={24}
							color={currentSession.status === SessionStatus.InProgress ? 'black' : (isConfirmed ? '#fff' : '#000')}
						/>
					</TouchableOpacity>
				)}
			</View>

			{/* Expanded panel */}
			{isExpanded && (
				<View className="px-4 pb-4">
					<Text
						className={`text-sm mb-3 ${currentSession.status === SessionStatus.InProgress ? 'text-black' : (isConfirmed ? 'text-white' : 'text-gray-400')}`}
					>
						{currentSession.note ||
							'No additional details provided.'}
					</Text>
					<View
						className={`flex-row items-center justify-center rounded-full py-0.5 mb-4 ${currentSession.status === SessionStatus.InProgress ? 'border border-black' : (isConfirmed ? 'border border-white' : '')}`}
						style={{
							width: '100%',
							backgroundColor: 'transparent'
						}}
					>
						<View className="flex-1 flex-row items-center justify-center py-3">
							<Feather
								name="calendar"
								size={22}
								color={currentSession.status === SessionStatus.InProgress ? 'black' : (isConfirmed ? '#fff' : '#000')}
							/>
							<Text
								className={`text-sm ml-2 font-medium ${currentSession.status === SessionStatus.InProgress ? 'text-black' : (isConfirmed ? 'text-white' : 'text-black')}`}
							>
								{formattedDate}
							</Text>
							<Text className={`text-xs ml-2 ${currentSession.status === SessionStatus.InProgress ? 'text-black' : (isConfirmed ? 'text-white' : 'text-green-400')}`}>{`${isNextDay ? '+1' : ''}`}</Text>
						</View>
						<View
							style={{ width: 1, height: 28 }}
							className={currentSession.status === SessionStatus.InProgress ? 'bg-black' : (isConfirmed ? 'bg-white' : 'bg-neutral-100')}
						/>
						<View className="flex-1 flex-row items-center justify-center">
							<Feather
								name="clock"
								size={22}
								color={currentSession.status === SessionStatus.InProgress ? 'black' : (isConfirmed ? '#fff' : '#000')}
							/>
							<Text
								className={`text-xs ml-2 font-medium ${currentSession.status === SessionStatus.InProgress ? 'text-black' : (isConfirmed ? 'text-white' : 'text-black')}`}
							>
								{formattedTimeRange}
							</Text>
						</View>
					</View>

					{/* Show buttons section only if NOT in progress */}
					{currentSession.status !== SessionStatus.InProgress ? (
					<View className="flex-row items-center justify-between mb-4">
						<TouchableOpacity
							onPress={isConfirmed ? handleNavigateToRequestSession : handleBookSession}
							disabled={isDisabled}
							activeOpacity={0.8}
							className={`${BTN_BASE}`}
							style={{
								width: '48%',
								backgroundColor: isConfirmed ? '#fff' : isDisabled ? '#d1d5db' : '#008DF4',
							}}
						>
							<Text
								className={`text-sm text-center ${isDisabled ? 'text-black' : isConfirmed ? 'text-black' : 'text-white'}`}
							>
								{bookText}
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={handleCancelSession}
							activeOpacity={0.8}
							className={`${BTN_PRIMARY}`}
							style={{ width: '48%' }}
						>
							<Text className="text-white text-sm text-center">
								Cancel
							</Text>
						</TouchableOpacity>
					</View>
					) : (
						/* Show cancel button for inProgress */
						<View className="flex-row items-center justify-center mb-4">
							<TouchableOpacity
								onPress={handleCancelSession}
								activeOpacity={0.8}
								className={`${BTN_PRIMARY}`}
								style={{ width: '100%' }}
							>
								<Text className="text-white text-sm text-center">
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
					)}

					<View className="flex-row items-center justify-between mb-3">
						<View className="flex-row items-center gap-1">
							<Feather
								name={
									currentSession.status === SessionStatus.InProgress
										? 'play-circle'
										: isConfirmed
											? 'check-circle'
										: 'alert-circle'
								}
								size={22}
								color={currentSession.status === SessionStatus.InProgress ? 'black' : (isConfirmed ? '#fff' : '#9ca3af')}
								style={{ marginLeft: 4 }}
							/>
							<Text
								className={`text-sm ${currentSession.status === SessionStatus.InProgress ? 'text-black' : (isConfirmed ? 'text-white' : 'text-neutral-500')}`}
							>
								{currentSession.status === SessionStatus.InProgress
									? 'Session in Progress'
									: isConfirmed
									? 'Appointment Confirmed'
									: 'Awaiting confirmation'}
							</Text>
						</View>
						<Text
							className={`text-sm ${currentSession.status === SessionStatus.InProgress ? 'text-black' : (isConfirmed ? 'text-white' : 'text-neutral-500')}`}
						>
							Total Cost:{' '}
							<Text className="font-bold">${costLabel}</Text>
						</Text>
					</View>

					{/* Show change time button only if NOT in progress */}
					{currentSession.status !== SessionStatus.InProgress && !isConfirmed && (
						<TouchableOpacity
							onPress={handleNavigateToRequestSession}
							activeOpacity={0.8}
							className={`border px-5 py-2 items-center rounded-lg ${isConfirmed ? 'border-white' : 'border-black'}`}
						>
							<Text
								className={`text-sm ${isConfirmed ? 'text-white' : 'text-black'}`}
							>
								Request Date/Time Change
							</Text>
						</TouchableOpacity>
					)}
				</View>
			)}
		</LinearGradient>
	);
};

export default ChatHeader;
