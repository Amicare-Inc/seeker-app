import React, { useState, useRef } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, TouchableWithoutFeedback, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { useHomeTab } from '@/features/userDirectory';
import { router } from 'expo-router';
import { UserCardSeeker, UserCardExpanded } from '@/features/userDirectory';
import { User } from '@/types/User';
import { SessionFilterCard } from '@/features/sessions';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveProfile } from '@/redux/activeProfileSlice';
import { useActiveSession } from '@/lib/context/ActiveSessionContext';
import { RootState } from '@/redux/store';

const PswHomeTab = () => {
	// Fetch available care seekers (isPsw = false)
	const [filteredUsers, setFilteredUsers] = useState<User[] | null>(null);
	const { users: fetchedUsers, isLoading, error } = useHomeTab(false, true); // isPsw = false, withDistance = true
	const [filterVisible, setFilterVisible] = useState(false);
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const slideAnim = useRef(new Animated.Value(300)).current;
	const dispatch = useDispatch();
	const { setActiveEnrichedSession } = useActiveSession();
	const currentUser = useSelector((state: RootState) => state.user.userData);
	const isVerified = currentUser?.idManualVerified ?? false;

	// Use filtered users if available, otherwise use fetched users
	const users = filteredUsers ?? fetchedUsers;

	const handleCardPress = (user: User) => {
		if (!isVerified) return; // Prevent interaction when not verified
		
		// Debug: Log what family member is being clicked
		if (user.isFamilyMemberCard && user.familyMemberInfo) {
			console.log('🔍 Family member card clicked:', {
				coreUserId: user.id,
				familyMemberId: user.familyMemberInfo.id,
				familyMemberName: `${user.familyMemberInfo.firstName} ${user.familyMemberInfo.lastName}`,
				coreUserName: `${user.firstName} ${user.lastName}`
			});
		} else {
			console.log('🔍 Regular user card clicked:', {
				userId: user.id,
				userName: `${user.firstName} ${user.lastName}`,
				isPsw: user.isPsw
			});
		}

		// Clear any active session to prevent conflicts with home tab navigation
		setActiveEnrichedSession(null);

		// Navigate with proper PSW info
		dispatch(setActiveProfile(user));
		router.push('/other-user-profile');
	};

	const renderItem = ({ item }: { item: User }) => (
		<UserCardSeeker
			user={item}
			familyMember={item.isFamilyMemberCard ? item.familyMemberInfo : undefined}
			distanceInfo={item.distanceInfo}
			onPress={() => handleCardPress(item)}
		/>
	);

	const showFilterCard = () => {
		if (!isVerified) return; // Prevent filter when not verified
		setFilterVisible(true);
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}),
		]).start();
	};

	const hideFilterCard = () => {
		Animated.parallel([
			Animated.timing(fadeAnim, {
				toValue: 0,
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
				backgroundColor: '#f2f2f7',
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
						keyExtractor={(item) => item.isFamilyMemberCard 
							? `${item.id}-${item.familyMemberInfo?.id}` 
							: item.id!
						}
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
							zIndex: 100,
						}}
					>
						<View
							style={{
								flex: 1,
								justifyContent: 'flex-end',
							}}
						>
							<Animated.View
								style={{
									transform: [{ translateY: slideAnim }],
								}}
							>
								<SessionFilterCard
									onClose={hideFilterCard}
									setFilteredUsers={(filteredData) => {
										setFilteredUsers(filteredData);
										hideFilterCard();
									}}
								/>
							</Animated.View>
						</View>
					</Animated.View>
				</TouchableWithoutFeedback>
			)}
		</SafeAreaView>
	);
};

export default PswHomeTab;