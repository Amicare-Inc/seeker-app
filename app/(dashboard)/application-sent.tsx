import React, { useState, useRef } from 'react';
import {
	View,
	Text,
	Image,
	TouchableOpacity,
	ScrollView,
	Animated,
	Dimensions,
	SafeAreaView,
	PanResponder
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getSessionDisplayInfo } from '@/features/sessions/utils/sessionDisplayUtils';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const { height: screenHeight } = Dimensions.get('window');

const ApplicationSent = () => {
	const { sessionData } = useLocalSearchParams();
	const parsedData = sessionData ? JSON.parse(sessionData as string) : null;
	const session = parsedData?.session;
	const otherUser = parsedData?.otherUser;
	
	const currentUser = useSelector((state: RootState) => state.user.userData);
	const displayInfo = session && currentUser ? getSessionDisplayInfo(session, currentUser) : null;

	const [isExpanded, setIsExpanded] = useState(false);
	const slideAnim = useRef(new Animated.Value(200)).current;
	const gestureStartValue = useRef(0);

	// Pan gesture handler for swipe gestures
	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (evt, gestureState) => {
				return Math.abs(gestureState.dy) > 10 && Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
			},
			onPanResponderGrant: () => {
				gestureStartValue.current = isExpanded ? screenHeight * 0.85 : 200;
			},
			onPanResponderMove: (evt, gestureState) => {
				const newValue = gestureStartValue.current - gestureState.dy;
				const constrainedValue = Math.max(200, Math.min(screenHeight * 0.85, newValue));
				slideAnim.setValue(constrainedValue);
			},
			onPanResponderRelease: (evt, gestureState) => {
				const swipeThreshold = 50;
				const shouldExpand = gestureState.dy < -swipeThreshold;
				const shouldCollapse = gestureState.dy > swipeThreshold;
				
				let targetExpanded = isExpanded;
				if (shouldExpand && !isExpanded) {
					targetExpanded = true;
				} else if (shouldCollapse && isExpanded) {
					targetExpanded = false;
				}
				
				const toValue = targetExpanded ? screenHeight * 0.85 : 200;
				Animated.timing(slideAnim, {
					toValue,
					duration: 300,
					useNativeDriver: false,
				}).start();
				
				setIsExpanded(targetExpanded);
			},
		})
	).current;

	// Helper functions to format session data
	const getFormattedTime = (isoString: string) => {
		if (!isoString) return null;
		try {
			const date = new Date(isoString);
			return date.toLocaleTimeString('en-US', { 
				hour: 'numeric', 
				minute: '2-digit', 
				hour12: true 
			});
		} catch {
			return null;
		}
	};

	const getFormattedDate = (isoString: string) => {
		if (!isoString) return null;
		try {
			const date = new Date(isoString);
			return date.toLocaleDateString('en-US', {
				weekday: 'short',
				day: 'numeric',
				month: 'short'
			});
		} catch {
			return null;
		}
	};

	// Calculate duration and get pricing from session
	const calculateSessionDuration = () => {
		if (!session?.startTime || !session?.endTime) return 4; // Default 4 hours
		try {
			const start = new Date(session.startTime);
			const end = new Date(session.endTime);
			return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60));
		} catch {
			return 4;
		}
	};

	const sessionDuration = calculateSessionDuration();
	// Use billingDetails from session object (calculated by pricing algorithm)
	// Fall back to calculated values only if billingDetails is unavailable
	const basePrice = session?.billingDetails?.basePrice ?? (sessionDuration * (session?.hourlyRate || 25));
	const taxes = session?.billingDetails?.taxes ?? (Math.round(basePrice * 0.13 * 100) / 100);
	const serviceFee = session?.billingDetails?.serviceFee ?? 40;
	const totalAmount = session?.billingDetails?.total ?? (basePrice + taxes + serviceFee);
	const hourlyRate = session?.hourlyRate || 25;

	const toggleExpansion = () => {
		const toValue = isExpanded ? 200 : screenHeight * 0.85;
		Animated.timing(slideAnim, {
			toValue,
			duration: 300,
			useNativeDriver: false,
		}).start();
		setIsExpanded(!isExpanded);
	};

	const handleBack = () => {
		router.back();
	};

	const getImageSource = () => {
		const photoUrl = displayInfo?.primaryPhoto;
		if (photoUrl && photoUrl.trim() !== '') {
			return { uri: photoUrl };
		}
		return require('@/assets/default-profile.png');
	};

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#f8f9fa' }}>
			{/* Profile Header */}
			<View style={{ padding: 16, backgroundColor: '#f8f9fa', marginTop: 20 }}>
				<TouchableOpacity onPress={handleBack} style={{ marginBottom: 16 }}>
					<Ionicons name="chevron-back" size={24} color="#333" />
				</TouchableOpacity>
				
				<View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
					<Image
						source={getImageSource()}
						style={{
							width: 48,
							height: 48,
							borderRadius: 24,
							marginRight: 12,
							backgroundColor: '#f0f0f0',
						}}
						resizeMode="cover"
					/>
					<View style={{ flex: 1 }}>
						<View style={{ flexDirection: 'row', alignItems: 'center' }}>
							<Text style={{ fontSize: 20, fontWeight: '600', color: '#333' }}>
								{displayInfo?.primaryName || `${otherUser?.firstName} ${otherUser?.lastName?.charAt(0)}.`}
							</Text>
							<Ionicons 
								name="checkmark-circle" 
								size={16} 
								color="#007AFF" 
								style={{ marginLeft: 6 }} 
							/>
							<Ionicons 
								name="information-circle-outline" 
								size={16} 
								color="#999" 
								style={{ marginLeft: 4 }} 
							/>
						</View>
						<Text style={{ fontSize: 14, color: '#666', marginTop: 2 }}>
							{displayInfo?.subtitle || `${otherUser?.address?.city || 'Midtown'}, ${otherUser?.address?.province || 'Toronto'}`}
						</Text>
					</View>
				</View>

				<Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 }}>
					Seeking support with:
				</Text>
				<Text style={{ fontSize: 14, color: '#666', marginBottom: 16 }}>
					{session?.careNeeds?.join(', ') || 'Meal Prep, Mobility Assistance'}
				</Text>

				<Text style={{ fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 }}>
					Bio
				</Text>
				<Text style={{ fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 20 }}>
					{otherUser?.bio || 'Hello, I am a 70 year old retiree seeking support with daily tasks and mobility. Lorem ipsum dolor sit amet adipiscing elit. Velit amor sit fin. Curabitur pharetra turpis eu efficitur lacinia. Maecenas id vestibulum magna. Etiam scelerisque at dolor id aliquet.'}
				</Text>

				{/* Action Buttons */}
				<View style={{ flexDirection: 'row', marginBottom: 16 }}>
					<TouchableOpacity
						style={{
							flex: 1,
							backgroundColor: '#333',
							paddingVertical: 12,
							borderRadius: 8,
							marginRight: 8,
							alignItems: 'center',
							flexDirection: 'row',
							justifyContent: 'center',
						}}
					>
						<Ionicons name="chatbubble-outline" size={16} color="white" />
						<Text style={{ color: 'white', fontWeight: '600', marginLeft: 6 }}>Message</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							flex: 1,
							backgroundColor: '#333',
							paddingVertical: 12,
							borderRadius: 8,
							marginHorizontal: 4,
							alignItems: 'center',
							flexDirection: 'row',
							justifyContent: 'center',
						}}
					>
						<Ionicons name="arrow-forward-outline" size={16} color="white" />
						<Text style={{ color: 'white', fontWeight: '600', marginLeft: 6 }}>Connect</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={{
							backgroundColor: '#e0e0e0',
							paddingVertical: 12,
							paddingHorizontal: 16,
							borderRadius: 8,
							marginLeft: 8,
							alignItems: 'center',
						}}
					>
						<Ionicons name="flag-outline" size={16} color="#666" />
						<Text style={{ color: '#666', fontSize: 12, marginTop: 2 }}>Report Issue</Text>
					</TouchableOpacity>
				</View>
			</View>

			{/* Bottom Sheet Container */}
			<Animated.View
				style={{
					position: 'absolute',
					bottom: 0,
					left: 0,
					right: 0,
					height: slideAnim,
					backgroundColor: '#6B7280',
					borderTopLeftRadius: 16,
					borderTopRightRadius: 16,
					paddingHorizontal: 20,
					paddingTop: 12,
				}}
			>
				{/* Handle Bar with Swipe Gesture */}
				<View
					{...panResponder.panHandlers}
					style={{
						alignItems: 'center',
						paddingVertical: 16,
						marginBottom: 8,
					}}
				>
					<TouchableOpacity
						onPress={toggleExpansion}
						style={{
							alignItems: 'center',
							paddingVertical: 4,
						}}
					>
						<View
							style={{
								width: 40,
								height: 4,
								backgroundColor: 'rgba(255,255,255,0.3)',
								borderRadius: 2,
							}}
						/>
					</TouchableOpacity>
				</View>

				{/* Status Text */}
				<Text style={{ color: 'white', fontSize: 18, fontWeight: '600', marginBottom: 16 }}>
					{isExpanded ? 'Application Sent: Awaiting Booking' : 'Application Sent: Awaiting final booking'}
				</Text>

				{/* Session Details Card */}
				<View style={{ 
					backgroundColor: 'white', 
					borderRadius: 25, 
					paddingVertical: 10,
					paddingHorizontal: 12,
					marginBottom: 16,
					flexDirection: 'row',
					alignItems: 'center',
					justifyContent: 'space-between',
					maxWidth: '100%'
				}}>
					<View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
						<Ionicons name="calendar-outline" size={16} color="#666" style={{ marginRight: 8 }} />
						<Text style={{ color: '#333', fontSize: 14, fontWeight: '600' }}>
							{getFormattedDate(session?.startTime) || 'Thurs, 18 Oct'}
						</Text>
					</View>
					<View style={{ 
						width: 1, 
						height: 16, 
						backgroundColor: '#ddd', 
						marginHorizontal: 8 
					}} />
					<View style={{ flex: 1 }}>
						<Text style={{ color: '#333', fontSize: 14, fontWeight: '600', textAlign: 'right' }} numberOfLines={1}>
							{(session?.startTime && session?.endTime) ? 
								`${getFormattedTime(session.startTime)} - ${getFormattedTime(session.endTime)}` : 
								'07:00 pm - 11:00 pm'
							}
						</Text>
					</View>
				</View>

				{/* Expanded Content */}
				{isExpanded && (
					<ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
						{/* Session Checklist */}
						<View style={{ marginBottom: 20 }}>
							<Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
								Session Checklist
							</Text>
							
							{/* Dynamic checklist from session data */}
							{session?.careNeeds && session.careNeeds.length > 0 ? (
								session.careNeeds.map((need: string, index: number) => (
									<Text key={index} style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 6 }}>
										{index + 1}. {need}
									</Text>
								))
							) : (
								// Fallback checklist items
								<>
									<Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 6 }}>
										1. Personal care assistance
									</Text>
									<Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 6 }}>
										2. Mobility support
									</Text>
									<Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 6 }}>
										3. Daily living activities
									</Text>
									<Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 6 }}>
										4. Medication reminders
									</Text>
									<Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 6 }}>
										5. Light housekeeping
									</Text>
									<Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 6 }}>
										6. Meal preparation
									</Text>
									<Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginBottom: 12 }}>
										7. Companionship and social support
									</Text>
								</>
							)}
						</View>

						{/* Pricing Details - Only in expanded view */}
						<View style={{ marginBottom: 20 }}>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
								<Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
									Base Price ({sessionDuration}hrs × ${hourlyRate}/hr)
								</Text>
								<Text style={{ color: 'white', fontSize: 14 }}>
									${basePrice.toFixed(2)}
								</Text>
							</View>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
								<Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
									Taxes
								</Text>
								<Text style={{ color: 'white', fontSize: 14 }}>
									${taxes.toFixed(2)}
								</Text>
							</View>
							<View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
								<Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14 }}>
									Service Fee
								</Text>
								<Text style={{ color: 'white', fontSize: 14 }}>
									${serviceFee.toFixed(2)}
								</Text>
							</View>
							<View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginBottom: 16 }} />
						</View>

						{/* Chat Status and Total */}
						<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
							<View style={{ flexDirection: 'row', alignItems: 'center' }}>
								<View style={{ 
									width: 16, 
									height: 16, 
									borderRadius: 8, 
									backgroundColor: 'white', 
									marginRight: 8,
									alignItems: 'center',
									justifyContent: 'center'
								}}>
									<Ionicons name="checkmark" size={10} color="#6B7280" />
								</View>
								<Text style={{ color: 'white', fontSize: 14 }}>
									{isExpanded ? 'Awaiting Booking' : 'Chat unlocked'}
								</Text>
							</View>
							<Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
								Total: ${session?.totalAmount || totalAmount.toFixed(2)}
							</Text>
						</View>

						{/* Bottom Actions */}
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
							<TouchableOpacity onPress={handleBack}>
								<View style={{ flexDirection: 'row', alignItems: 'center' }}>
									<Ionicons name="chevron-back" size={16} color="white" />
									<Text style={{ color: 'white', fontSize: 14, marginLeft: 4 }}>
										BACK
									</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity>
								<Text style={{ color: 'white', fontSize: 14 }}>
									Change/Cancel
								</Text>
							</TouchableOpacity>
						</View>

						{/* Bottom Warning */}
						<View style={{ flexDirection: 'row', alignItems: 'flex-start', paddingBottom: 40 }}>
							<View style={{ 
								width: 8, 
								height: 8, 
								borderRadius: 4, 
								backgroundColor: '#FFC107', 
								marginRight: 8,
								marginTop: 6
							}} />
							<Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, lineHeight: 16, flex: 1 }}>
								Awaiting final booking from Client. Feel free to message them if you need any changes.
							</Text>
						</View>
					</ScrollView>
				)}
			</Animated.View>
		</SafeAreaView>
	);
};

export default ApplicationSent;