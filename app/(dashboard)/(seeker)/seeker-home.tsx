// @/screens/SeekerHomeTab.tsx
import React, { useState } from 'react';
import { SafeAreaView, View, Text, ActivityIndicator, FlatList, TouchableOpacity, Platform } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useHomeTab } from '@/features/userDirectory';
import { UserCard, UserCardExpanded } from '@/features/userDirectory';
import { User } from '@/types/User';

const SeekerHomeTab = () => {
	const { users, loading, error } = useHomeTab(true);
	const [expandedUserId, setExpandedUserId] = useState<string | null>(null);

	const handleCardPress = (userId: string) => {
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
		<SafeAreaView className="flex-1" style={{ backgroundColor: '#f0f0f0' }}>
			{/* Header row */}
			<View className="flex-row items-center justify-between px-4 pb-2">
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

			{/* Main content */}
			{loading ? (
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#000" />
				</View>
			) : error ? (
				<View className="flex-1 items-center justify-center">
					<Text className="text-black">Error: {error}</Text>
				</View>
			) : (
				<FlatList
					data={users}
					keyExtractor={(item) => item.id!}
					renderItem={renderItem}
					contentContainerStyle={{
						paddingBottom: Platform.OS === 'ios' ? 83 : 64,
						paddingHorizontal: 10,
					}}
				/>
			)}
		</SafeAreaView>
	);
};

export default SeekerHomeTab;
