// src/components/Chat/ChatHeader.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { User } from '@/types/User';
import { EnrichedSession } from '@/types/EnrichedSession';
import { getSessionDisplayInfo } from '@/features/sessions/utils/sessionDisplayUtils';
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
	const currentUser = useSelector((state: RootState) => state.user.userData);
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

	// Get display info for the session
	const displayInfo = currentUser ? getSessionDisplayInfo(session, currentUser) : null;
	
	// Check if we should show dual photos (family member case)
	// Only show dual photos when PSW is viewing a session where seeker booked for family member
	const isShowingFamilyMember = currentUser?.isPsw && session.careRecipient && session.careRecipientType === 'family' && session.otherUser;
	
	// Determine which photos and names to show
	const primaryPhoto = displayInfo?.primaryPhoto || user.profilePhotoUrl;
	const primaryName = displayInfo?.primaryName || `${user.firstName} ${user.lastName}`;
	const secondaryPhoto = isShowingFamilyMember ? session.otherUser?.profilePhotoUrl : undefined;

	return (
		<View style={{ backgroundColor: '#fff' }}>
			{/* Top row */}
			<View className="flex-row items-center px-4 mb-[16px]">
				<TouchableOpacity onPress={() => router.back()} className="mr-3">
					<Feather name="chevron-left" size={24} color="#000" />
				</TouchableOpacity>
				
				{/* Profile Photo Section */}
				<View className="relative mr-[13px]" style={{ width: isShowingFamilyMember ? 64 : 44 }}>
					{isShowingFamilyMember ? (
						<>
							{/* Family member photo (main position) */}
							<Image
								source={{ uri: primaryPhoto || 'https://via.placeholder.com/50' }}
								className="w-[44px] h-[44px] rounded-full"
								style={{ 
									zIndex: 2,
									shadowColor: '#000', 
									shadowOffset: { width: 0, height: 2 }, 
									shadowOpacity: 0.1, 
									shadowRadius: 3 
								}}
							/>
							{/* Core user photo (slight overlap to the right) */}
							<Image
								source={{ uri: secondaryPhoto || 'https://via.placeholder.com/50' }}
								className="w-[44px] h-[44px] rounded-full absolute"
								style={{ 
									right: -20,
									top: 0,
									zIndex: 1,
									shadowColor: '#000', 
									shadowOffset: { width: 0, height: 2 }, 
									shadowOpacity: 0.1, 
									shadowRadius: 3 
								}}
							/>
						</>
					) : (
						<Image
							source={{
								uri: primaryPhoto || 'https://via.placeholder.com/50',
							}}
							className="w-[44px] h-[44px] rounded-full"
							style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 }}
						/>
					)}
				</View>
				
				<TouchableOpacity onPress={toggleExpanded} className="flex-1" style={{ marginLeft: isShowingFamilyMember ? 20 : 0 }}>
					<Text className="font-semibold text-lg text-black">
						{primaryName}
					</Text>
					<Text className="text-xs mt-0.5 text-gray-500">
						{isShowingFamilyMember && session.otherUser ? `Contact: ${session.otherUser.firstName}` : subTitle}
					</Text>
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
					{currentSession.status !== 'inProgress' && !isConfirmed && !isUserConfirmed && (
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
							{/* Only show checkmark for confirmed sessions or when accepted but not yet booked */}
							{(isConfirmed || (!isUserConfirmed && currentSession.status !== 'inProgress')) && (
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
							)}
							<Text className="text-sm font-medium text-[#797979]">
								{currentSession.status === 'inProgress'
									? 'Session in Progress'
									: isConfirmed
									? 'Session Booked'
									: isUserConfirmed
									? 'Booking sent for approval'
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
