// @/components/Profile/UserCardExpanded.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { setActiveProfile } from '@/redux/activeProfileSlice';
import { useDispatch } from 'react-redux';
import { useRouter } from 'expo-router';
import { User } from '@/types/User';
import { setActiveEnrichedSession } from '@/redux/sessionSlice';

interface UserCardExpandedProps {
	user: User;
	onClose: () => void; // Called when the user taps outside the buttons to collapse the card
}

const UserCardExpanded: React.FC<UserCardExpandedProps> = ({
	user,
	onClose,
}) => {
	const router = useRouter();
	const dispatch = useDispatch();

	// Build strings for tasks and care type; if none, show an empty string.
	const tasks = user.carePreferences?.tasks?.length
		? user.carePreferences.tasks.join(', ')
		: '';
	const diagnosed = user.carePreferences?.careType?.length
		? user.carePreferences.careType.join(', ')
		: '';

	const bioText = user.bio;
	const rating = '4.6 out of 5';
	const rate = user.rate ?? 20;
	const locationText = user.address || '4km away';
	const languages = ''; // or empty string if not provided

	// Navigates to request-sessions with this user's ID
	const handleRequestSession = () => {
		router.push({
			pathname: '/request-sessions',
			params: { otherUserId: user.id },
		});
	};

	// Navigates to the profile page for this user; passes myProfile: false.
	const handleMoreInfo = () => {
		dispatch(setActiveProfile(user));
		dispatch(setActiveEnrichedSession(null));
		router.push('/other-user-profile');
	};

	return (
		// The entire card closes on press (except on button presses)
		<TouchableOpacity
			onPress={onClose}
			activeOpacity={1}
			className="bg-white rounded-lg p-4 mb-2"
			style={{ elevation: 2 }}
		>
			<View pointerEvents="box-none">
				{/* Header row: Image, Name + rating, Rate */}
				<View className="flex-row items-center justify-between mb-4">
					<View className="flex-row items-center">
						<Image
							source={{
								uri:
									user.profilePhotoUrl ||
									'https://via.placeholder.com/50',
							}}
							// Now a square image with rounded corners.
							className="w-20 h-20 rounded-lg mr-3"
						/>
						<View>
							<Text className="font-bold text-lg text-black">
								{user.firstName} {user.lastName}
							</Text>
							<Text className="text-gray-500 text-sm">
								{rating}
							</Text>
						</View>
					</View>
					<Text className="font-bold text-base text-black">
						${rate.toFixed(2)}
					</Text>
				</View>

				{/* Bio Section */}
				<Text className="font-bold text-gray-800 mb-1">Bio</Text>
				<Text className="text-gray-700 mb-3">{bioText}</Text>

				{/* Skill Sets */}
				<Text className="font-bold text-gray-800 mb-1">
					{user.isPsw ? 'Tasks I Can Assist With' : 'Requiring Help With'}
				</Text>
				<Text className="text-gray-700 mb-3">{tasks}</Text>

				{/* Diagnosed Conditions */}
				<Text className="font-bold text-gray-800 mb-1">
					{user.isPsw ? 'Services Provided' : 'Services Needed'}
				</Text>
				<Text className="text-gray-700 mb-3">{diagnosed}</Text>

				{/* Languages and Location */}
				<View className="flex-row justify-between">
					<View className="mr-2">
						<Text className="font-bold text-gray-800 mb-1">
							Languages
						</Text>
						<Text className="text-gray-700">{languages}</Text>
					</View>
					<View className="ml-2">
						<Text className="font-bold text-gray-800 mb-1">
							Location
						</Text>
						<Text className="text-gray-700">{locationText}</Text>
					</View>
				</View>

				{/* Bottom buttons row */}
				<View className="flex-row mt-4" pointerEvents="box-none">
					{/* Request Session Button */}
					<TouchableOpacity
						onPress={(e) => {
							e.stopPropagation();
							handleRequestSession();
						}}
						className="bg-blue-500 flex-1 mr-2 p-3 rounded-lg items-center"
					>
						<Text className="text-white font-bold">
							Request Session
						</Text>
					</TouchableOpacity>
					{/* More Info Button */}
					<TouchableOpacity
						onPress={(e) => {
							e.stopPropagation();
							handleMoreInfo();
						}}
						className="bg-black flex-1 ml-2 p-3 rounded-lg items-center"
					>
						<Text className="text-white font-bold">More Info</Text>
					</TouchableOpacity>
				</View>
			</View>
		</TouchableOpacity>
	);
};

export default UserCardExpanded;
