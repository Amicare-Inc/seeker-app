// src/components/Chat/ChatHeader.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import { User } from '@/types/User';
import { EnrichedSession } from '@/types/EnrichedSession';
import { useChatHeader } from './useChatHeader';

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
		<View style={{ backgroundColor: '#fff' }}>
			{/* Top row */}
			<View className="flex-row items-center px-4 mb-[16px]">
				<TouchableOpacity onPress={() => router.back()} className="mr-3">
					<Feather name="chevron-left" size={24} color="#000" />
				</TouchableOpacity>
				<Image
					source={{
						uri: user.profilePhotoUrl || 'https://via.placeholder.com/50',
					}}
					className="w-[44px] h-[44px] rounded-full mr-[13px]"
				/>
				<TouchableOpacity onPress={toggleExpanded} className="flex-1">
					<Text className="font-semibold text-lg text-black">
						{user.firstName} {user.lastName}
					</Text>
					<Text className="text-xs mt-0.5 text-gray-500">{subTitle}</Text>
				</TouchableOpacity>
				{isExpanded && (
					<TouchableOpacity onPress={handleNavigateToUserProfile}>
						<Ionicons
							name="information-circle-outline"
							size={28}
							color="#303031"
						/>
					</TouchableOpacity>
				)}
			</View>

			{/* Expanded panel */}
			{isExpanded && (
				<View className="px-4 mb-[16px]">
					<Text className="text-sm mb-3 font-medium text-[#797979]">
						{currentSession.note || 'No additional details provided.'}
					</Text>

					<View
						className="flex-row items-center justify-center rounded-full py-0.5 mb-[16px]"
						style={{
							width: '100%',
							borderWidth: isConfirmed ? 0 : 1,
							borderColor: isConfirmed ? undefined : '#E5E5EA',
							backgroundColor: isConfirmed ? '#DCDCE1' : '#F2F2F7',
						}}
					>
						<View className="flex-1 flex-row items-center justify-center py-3 ">
							<Ionicons name="calendar" size={20} color="#303031" />
							<Text className="text-base ml-2 font-medium">
								{formattedDate}
							</Text>
							<Text
								className="text-xs ml-2"
								style={{ color: isConfirmed ? '#75D87F' : '#22c55e' }}
							>
								{`${isNextDay ? '+1' : ''}`}
							</Text>
						</View>
						<View style={{ width: 1, height: 28, backgroundColor: '#fff' }} />
						<View className="flex-1 flex-row items-center justify-center">
							<Ionicons name="time" size={20} color="#303031" />
							<Text className="text-sm ml-2 font-medium">
								{formattedTimeRange}
							</Text>
						</View>
					</View>

					{/* Show book button */}
					{currentSession.status !== 'inProgress' && !isConfirmed && (
						<View className="mb-4">
							{!isDisabled && (
								<TouchableOpacity
									onPress={handleBookSession}
									className="px-6 py-3 rounded-lg"
									style={{
										width: '100%',
										backgroundColor: '#008DF4',
									}}
								>
									<Text className="text-lg font-bold text-center text-white">
										Book
									</Text>
								</TouchableOpacity>
							)}
						</View>
					)}

					<View className="flex-row items-center justify-between mb-[16px]">
						<View className="flex-row items-center gap-1">
							<Ionicons
								name="checkmark-circle"
								size={22}
								color={
									currentSession.status === 'inProgress'
										? 'black'
										: isConfirmed
										? '#75D87F'
										: '#0C7AE2'
								}
								style={{ marginLeft: 4 }}
							/>
							<Text className="text-sm font-medium text-[#797979]">
								{currentSession.status === 'inProgress'
									? 'Session in Progress'
									: isConfirmed
									? 'Awaiting Confirmation'
									: 'Request Accepted'}
							</Text>
						</View>
						<Text className="text-sm font-medium text-[#797979]">
							Total Cost: <Text className="font-semibold">${costLabel}</Text>
						</Text>
					</View>

					{/* Change / Cancel */}
					{currentSession.status !== 'inProgress' && (
						<View className="flex-row items-center justify-between">
							<TouchableOpacity className="">
								<Text className="text-sm font-medium text-grey-58 underline">
									Change
								</Text>
							</TouchableOpacity>
							<TouchableOpacity className="">
								<Text className="text-sm font-medium text-grey-58 underline">
									Cancel
								</Text>
							</TouchableOpacity>
						</View>
					)}
				</View>
			)}
		</View>
	);
};

export default ChatHeader;
