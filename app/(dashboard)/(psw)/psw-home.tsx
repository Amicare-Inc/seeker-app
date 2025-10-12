import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, TouchableWithoutFeedback, Platform, Animated } from 'react-native';
// Removed SafeAreaView for Android compatibility
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { useHomeTab } from '@/features/userDirectory';
import { router, useFocusEffect } from 'expo-router';
import { UserCardSeeker, UserCardExpanded } from '@/features/userDirectory';
import { User } from '@/types/User';
import { SessionFilterCard } from '@/features/sessions';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveProfile } from '@/redux/activeProfileSlice';
import { useActiveSession } from '@/lib/context/ActiveSessionContext';
import { RootState } from '@/redux/store';
import ReactNative from 'react-native';
import { useCallback } from 'react';
import { AuthApi } from '@/features/auth/api/authApi';
import { updateUserFields } from '@/redux/userSlice';

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
	const [showApprovalPopup, setShowApprovalPopup] = useState(false);
	const approvalFadeAnim = useRef(new (require('react-native').Animated).Value(0)).current;

	// Refresh current user on focus so verification updates immediately
	useFocusEffect(
		useCallback(() => {
			let active = true;
			(async () => {
				if (!currentUser?.id) return;
				try {
					const fresh = await AuthApi.getUser(currentUser.id);
					if (active && fresh) dispatch(updateUserFields(fresh));
				} catch {}
			})();
			return () => { active = false; };
		}, [currentUser?.id, dispatch])
	);

	useEffect(() => {
		if (showApprovalPopup) {
			require('react-native').Animated.timing(approvalFadeAnim, {
				toValue: 1,
				duration: 200,
				useNativeDriver: true,
			}).start();
		} else {
			require('react-native').Animated.timing(approvalFadeAnim, {
				toValue: 0,
				duration: 200,
				useNativeDriver: true,
			}).start();
		}
	}, [showApprovalPopup, approvalFadeAnim]);

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
		<View
			className="flex-1"
			style={{
				backgroundColor: '#f2f2f7',
				paddingTop: 32,
				paddingBottom: 32,
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
							paddingBottom: 96,
							paddingTop: 16,
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

			{/* Approval popup above verification banner */}
			{!isVerified && (
				<>
					<TouchableOpacity
						activeOpacity={1}
						onPress={() => setShowApprovalPopup(false)}
						style={{
							position: 'absolute',
							left: 16,
							right: 16,
							bottom: Platform.OS === 'ios' ? 325 : 300,
							zIndex: 21,
						}}
					>
						<Animated.View
							style={{
								opacity: approvalFadeAnim,
								backgroundColor: '#BBDAF7',
								borderRadius: 8,
								padding: 10,
								paddingVertical: 16,
								shadowColor: '#000',
								shadowOffset: { width: 0, height: 2 },
								shadowOpacity: 0.12,
								shadowRadius: 8,
								elevation: 2,
							}}
						>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Ionicons name="information-circle" size={40} color="#55A2EB" />
								<Text style={{ marginLeft: 8, fontWeight: '500', color: '#1a2a3a', fontSize: 13, width: "85%" }}>
									Approval is subject to our internal screening and terms of use. Since we are in beta, not all applications may be approved.
								</Text>
							</View>
						</Animated.View>
					</TouchableOpacity>

				</>
			)}

			{/* Verification Status Banner - Bottom */}
			{!isVerified && (
				<View 
					className="bg-brand-blue mx-4 mb-4 px-4 py-3 rounded-lg flex-row items-center"
					style={{
						position: 'absolute',
						bottom: Platform.OS === 'ios' ? 100 : 80,
						left: 0,
						right: 0,
						zIndex: 20,
					}}
				>
					<View className="flex-1">
						<View className="flex-row mb-2 items-center">
							<Ionicons name="checkmark-circle" size={20} color="white" style={{ marginRight: 8 }} />
							<Text className="text-white font-semibold text-base">Profile is under Review</Text>
							<TouchableOpacity onPress={() => setShowApprovalPopup((prev) => !prev)}>
								<Ionicons name="information-circle-outline" size={20} color="white" style={{ marginLeft: 8 }} />
							</TouchableOpacity>
						</View>
						<Text className="text-white text-sm opacity-90 mb-2">Your caregiver profile is currently under review.
						As Amicare is in limited Beta, this may take up to 20 business days. A member of our support team will reach out by phone or email to complete your pre-approval.
						You won’t be able to browse, message, or book until you're approved.
						</Text>
						<Text className="text-white text-sm opacity-90 font-medium">Need help? Visit “My Profile” {">"} "Support</Text>
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
	</View>
	);
};

export default PswHomeTab;