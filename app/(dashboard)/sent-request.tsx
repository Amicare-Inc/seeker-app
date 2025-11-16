import React from 'react';
import {
	SafeAreaView,
	View,
	Text,
	Image,
	TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const SessionRequestSent = () => {
	// Optional: if you want the other user's name or photo from Redux:
	const { otherUserId } = useLocalSearchParams();
	const currentUser = useSelector((state: RootState) => state.user.userData);
	const otherUser = useSelector((state: RootState) =>
		Object.values(state.user.allUsers).find((u) => u.id === otherUserId),
	);

	const handleBack = () => {
		// Navigate based on current user's role, not other user's role
		if (currentUser?.isPsw) {
            router.replace('/(dashboard)/(psw)/psw-sessions');
		} else {
			router.replace('/(dashboard)/(seeker)/seeker-sessions');
		}
	};

	// Or you can hardcode placeholders if you don't have a param.
	const maskedCardInfo = 'Mastercard Ending in 4021';
	const totalAmount = '$230.20';

	return (
		<SafeAreaView className="flex-1 bg-white">
			{/* Top bar with "Back Home" */}
			<View className="flex-row items-center p-4">
				<TouchableOpacity onPress={handleBack} /* or router.back() */>
					<Ionicons name="chevron-back" size={24} color="#000" />
				</TouchableOpacity>
			</View>

			{/* Main content */}
			<View className="flex-1 justify-center items-center px-4">
				{/* Possibly the other user's avatar */}
				<Image
					source={
						otherUser?.profilePhotoUrl
							? { uri: otherUser.profilePhotoUrl }
							: require('@/assets/default-profile.png')
					}
					className="w-20 h-20 rounded-full mb-4"
				/>

				{/* "Session Request Sent!" row */}
				<View className="flex-row items-center mb-2">
					<Ionicons name="paper-plane" size={30} color="#008DF4" />
					<Text className="text-lg font-semibold ml-2">
						Session Request Sent!
					</Text>
				</View>

				{/* Subtext about card being charged */}
				<Text className="text-sm text-gray-500 text-center mb-6">
					You have successfully sent a request to{' '}
					{otherUser?.firstName}. You can start chatting once they
					accept your request.
				</Text>

				{/* Payment Card / Price info */}
				{/* <View className="flex-row items-center bg-gray-100 px-3 py-2 rounded-lg mb-6">
          <Ionicons name="card" size={22} color="#000" />
          <Text className="text-black ml-2">{maskedCardInfo}</Text>
          <Text className="text-black ml-4">{totalAmount}</Text>
        </View> */}

				{/* "Session Details" button */}
				<TouchableOpacity
					onPress={handleBack}
					className="bg-black rounded-lg w-full py-4 items-center"
				>
					<Text className="text-white font-bold text-base">
						Back to Home
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
};

export default SessionRequestSent;
