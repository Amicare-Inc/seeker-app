import React, { useState } from 'react';
import {
	View,
	Text,
	ActivityIndicator,
	FlatList,
	TouchableOpacity,
	Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; // Import from context library
import Ionicons from '@expo/vector-icons/Ionicons';
import useAvailableUsers from '@/hooks/useHomeTab';
import { router } from 'expo-router';
import UserCard from '@/components/UserCard';
import UserCardExpanded from '@/components/UserCardExpanded';
import { User } from '@/types/User';

const PswHomeTab = () => {
	// Fetch available care seekers (isPsw = false)
	const { users, loading, error } = useAvailableUsers(false);
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
					onPress={() => handleCardPress(item.id)}
				/>
			)}
		</View>
	);

	return (
		<SafeAreaView // Use SafeAreaView from react-native-safe-area-context
			className="flex-1"
			style={{
				backgroundColor: '#f0f0f0',
			}}
		>
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
					<Text className="text-xl text-black">
						Explore Care Seekers
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
					keyExtractor={(item) => item.id}
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

export default PswHomeTab;
