import React, { useState } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useHomeTab } from '@/features/userDirectory';
import { UserCard, UserCardExpanded } from '@/features/userDirectory';
import { User } from '@/types/User';

const SeekerHomeTab = () => {
	const { users, isLoading, error } = useHomeTab(true, true); // isPsw = true, withDistance = true
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

			{/* Main content */}
			{isLoading ? (
				<View className="flex-1 items-center justify-center">
					<ActivityIndicator size="large" color="#000" />
				</View>
			) : error ? (
				<View className="flex-1 items-center justify-center">
					<Text className="text-black">Error: {error.message}</Text>
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
				/>
			)}
		</SafeAreaView>
	);
};

export default SeekerHomeTab;
