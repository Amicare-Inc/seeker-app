import React, { useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { useHomeTab } from '@/features/userDirectory';
import { UserCard, UserCardExpanded } from '@/features/userDirectory';
import { User } from '@/types/User';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const SeekerHomeTab = () => {
	const { users, isLoading, error } = useHomeTab(true, true); // isPsw = true, withDistance = true
	const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
	const currentUser = useSelector((state: RootState) => state.user.userData);
	const isVerified = currentUser?.idManualVerified ?? false;

	const handleCardPress = (userId: string) => {
		if (!isVerified) return; // Prevent interaction when not verified
		setExpandedUserId((prev) => (prev === userId ? null : userId));
	};

	const renderItem = ({ item }: { item: User }) => (
		<View>
			{expandedUserId === item.id ? (
				<UserCardExpanded
					user={item}
					onClose={() => setExpandedUserId(null)}
				/>
			) : (
				<UserCard
					user={item}
					onPress={() => handleCardPress(item.id!)}
				/>
			)}
		</View>
	);

	return (
		<SafeAreaView
			className="flex-1"
			style={{
				backgroundColor: '#f2f2f7',
			}}
		>
			<View className="flex-row items-center justify-between px-4 pb-2 mb-2">
				{/* Left side: Icon + Title */}
				<View className="flex-row items-center">
					<Ionicons
						name="people"
						size={24}
						color="black"
						style={{ marginRight: 8 }}
					/>
					<Text className="text-2xl text-black">
						Explore PSWs
					</Text>
				</View>

				{/* Right side: Filter icon */}
				<TouchableOpacity
					onPress={() => {
						/* Filter button currently does nothing */
					}}
				>
					<Ionicons name="options" size={24} color="black" />
				</TouchableOpacity>
			</View>

			{/* Main content with blur overlay */}
			<View className="flex-1 relative">
				{/* Main content */}
				{isLoading ? (
					<View className="flex-1 items-center justify-center">
						<ActivityIndicator size="large" color="#000" />
					</View>
				) : error ? (
					<View className="flex-1 items-center justify-center">
						<Text className="text-black">Error: {error.message || 'Something went wrong'}</Text>
					</View>
				) : (
					<FlatList
						data={users}
						keyExtractor={(item) => item.id!}
						renderItem={renderItem}
						contentContainerStyle={{
							paddingBottom: Platform.OS === 'ios' ? 83 : 64,
							paddingHorizontal: 20,
						}}
						scrollEnabled={isVerified}
						pointerEvents={isVerified ? 'auto' : 'none'}
					/>
				)}

				{/* Blur overlay when not verified */}
				{!isVerified && (
					<BlurView
						tint="light"
						intensity={15}
						experimentalBlurMethod="dimezisBlurView"
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							zIndex: 10,
						}}
					/>
				)}
			</View>

			{/* Verification Status Banner - Bottom */}
			{!isVerified && (
				<View 
					className="bg-blue-500 mx-4 mb-4 px-4 py-3 rounded-lg flex-row items-center"
					style={{
						position: 'absolute',
						bottom: Platform.OS === 'ios' ? 100 : 80,
						left: 0,
						right: 0,
						zIndex: 20,
					}}
				>
					<Ionicons name="checkmark-circle" size={20} color="white" style={{ marginRight: 8 }} />
					<View className="flex-1">
						<Text className="text-white font-semibold text-sm">Profile Submitted</Text>
						<Text className="text-white text-xs opacity-90">Your documents are now under review and will be verified within X days.</Text>
					</View>
				</View>
			)}
		</SafeAreaView>
	);
};

export default SeekerHomeTab;
