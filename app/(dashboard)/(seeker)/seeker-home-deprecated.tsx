import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, Platform, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { BlurView } from 'expo-blur';
import { useHomeTab } from '@/features/userDirectory';
import { UserCard, UserCardExpanded } from '@/features/userDirectory';
import { User } from '@/types/User';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { useFocusEffect, router } from 'expo-router';
import { AuthApi } from '@/features/auth/api/authApi';
import { updateUserFields } from '@/redux/userSlice';
import { useLiveSession } from '@/features/sessions';
import { LAYOUT_CONSTANTS } from '@/shared/constants/layout';

const SeekerHomeTab = () => {
  const { users, isLoading, error } = useHomeTab(true, true); // isPsw = true, withDistance = true
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const dispatch = useDispatch();
  const isVerified = currentUser?.idManualVerified ?? false;
  const [showApprovalPopup, setShowApprovalPopup] = useState(false);
  const fadeAnim = useRef(new (require('react-native').Animated).Value(0)).current;
  const activeLiveSession = useLiveSession();

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
	  require('react-native').Animated.timing(fadeAnim, {
		toValue: 1,
		duration: 200,
		useNativeDriver: true,
	  }).start();
	} else {
	  require('react-native').Animated.timing(fadeAnim, {
		toValue: 0,
		duration: 200,
		useNativeDriver: true,
	  }).start();
	}
  }, [showApprovalPopup, fadeAnim]);

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
		paddingTop: LAYOUT_CONSTANTS.SCREEN_TOP_PADDING
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
		  <Text className="text-2xl text-black">Explore PSWs</Text>
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
			  paddingBottom: LAYOUT_CONSTANTS.getContentBottomPadding(!!activeLiveSession),
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
				opacity: fadeAnim,
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
				  Approval is subject to our internal screening and Terms of Use. Since we are in beta, not all applications may be approved.
				</Text>
			  </View>
			</Animated.View>
		  </TouchableOpacity>

		  {/* Verification Status Banner - Bottom */}
		  <View 
			className="bg-brand-blue mb-4 px-4 py-3 rounded-lg flex-row items-center"
			style={{
			  position: 'absolute',
			  bottom: Platform.OS === 'ios' ? 100 : 80,
			  left: 16,
			  right: 16,
			  zIndex: 20,
			}}
		  >
			<View className="flex-1">
			  <View className="flex-row mb-2 items-center">
				<Text className="text-white font-semibold text-base">Profile is under Review</Text>
				<TouchableOpacity onPress={() => setShowApprovalPopup((prev) => !prev)}>
				  <Ionicons name="information-circle-outline" size={20} color="white" style={{ marginLeft: 8 }} />
				</TouchableOpacity>
			  </View>
			  <Text className="text-white text-sm opacity-90 mb-2">As Amicare is in limited beta, this may take up to 5 business days. During this time, booking and messaging are unavailable. Our support team will reach out by phone or email to complete your pre-approval. Booking and messaging are unavailable until you're approved.
			  </Text>
			  <Text className="text-white text-sm opacity-90 font-medium">Need help? Visit "My Profile" {">"} "Help"</Text>
			</View>
		  </View>
		</>
	  )}
	</SafeAreaView>
  );
};

export default SeekerHomeTab;
