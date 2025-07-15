import React, { useState, useRef } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, TouchableWithoutFeedback, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useHomeTab } from '@/features/userDirectory';
import { router } from 'expo-router';
import { UserCardSeeker, UserCardExpanded } from '@/features/userDirectory';
import { User } from '@/types/User';
import { SessionFilterCard } from '@/features/sessions';
import { useDispatch } from 'react-redux';
import { setActiveProfile } from '@/redux/activeProfileSlice';
import { useActiveSession } from '@/lib/context/ActiveSessionContext';

const PswHomeTab = () => {
	// Fetch available care seekers (isPsw = false)
	const [filteredUsers, setFilteredUsers] = useState<User[] | null>(null);
	const { users: fetchedUsers, loading, error } = useHomeTab(false, true); // isPsw = false, withDistance = true
	const [filterVisible, setFilterVisible] = useState(false);
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(300)).current;
	const dispatch = useDispatch();
	const { setActiveEnrichedSession } = useActiveSession();

	// Use filtered users if available, otherwise use fetched users
	const users = filteredUsers ?? fetchedUsers;

	const handleCardPress = (user: User) => {
		// Clear any active session to prevent conflicts with home tab navigation
		setActiveEnrichedSession(null);
		// Navigate to other-user-profile instead of expanding
		dispatch(setActiveProfile(user));
		router.push('/other-user-profile');
	};

	const renderItem = ({ item }: { item: User }) => (
		<UserCardSeeker
			user={item}
			onPress={() => handleCardPress(item)}
		/>
	);

	const showFilterCard = () => {
		setFilterVisible(true);
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1, // Fade in
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.timing(slideAnim, {
				toValue: 0, // Slide up into view
				duration: 300,
				useNativeDriver: true,
			}),
		]).start();
	};

	const hideFilterCard = () => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 0, // Fade out
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.timing(slideAnim, {
				toValue: 400, // Slide down off-screen
				duration: 300,
				useNativeDriver: true,
			}),
		]).start(() => setFilterVisible(false));
	};

	return (
		<SafeAreaView
			className="flex-1"
			style={{
				backgroundColor: '#f0f0f0',
			}}
		>
			{/* Header row */}
			<View className="flex-row items-center justify-between px-4 pb-2 mb-2">
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
				<TouchableOpacity onPress={showFilterCard}>
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
						paddingHorizontal: 20,
					}}
				/>
			)}

			{/* Filter Overlay */}
			{filterVisible && (
				<TouchableWithoutFeedback onPress={hideFilterCard}>
					<Animated.View
						style={{
							position: 'absolute',
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							backgroundColor: 'rgba(0, 0, 0, 0.5)',
							opacity: fadeAnim,
							zIndex: 99,
						}}
					/>
				</TouchableWithoutFeedback>
			)}

			{/* Filter Card */}
			{filterVisible && (
				<Animated.View
					style={{
						position: 'absolute',
						left: 0,
						right: 0,
						bottom: 0,
						transform: [{ translateY: slideAnim }], // Animated slide
						zIndex: 100,
					}}
				>
					<SessionFilterCard onClose={hideFilterCard} setFilteredUsers={setFilteredUsers} />
				</Animated.View>
			)}
		</SafeAreaView>
	);
};

export default PswHomeTab;