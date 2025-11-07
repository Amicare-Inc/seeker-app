import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
	View,
	Text,
	ScrollView,
	TouchableOpacity,
	Image,
	ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
	SessionList,
	SessionBookedList,
	useLiveSession,
} from '@/features/sessions';
import { useSessionsTab } from '@/features/sessions';
import { EnrichedSession } from '@/types/EnrichedSession';
import { LAYOUT_CONSTANTS } from '@/shared/constants/layout';
import { useSessionApplications } from '@/features/sessions/hooks/useSessionApplications';
import { getSessionDisplayInfo } from '@/features/sessions/utils/sessionDisplayUtils';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const SeekerSessionsTab = () => {
	const {
		newRequests,
		pending,
		confirmed,
		loading,
		error,
		handleExpandSession,
	} = useSessionsTab('seeker');
	const activeLiveSession = useLiveSession();
	const currentUser = useSelector((state: RootState) => state.user.userData);

	// Debug logging
	console.log('🔍 [Sessions Debug]', {
		newRequestsCount: newRequests.length,
		pendingCount: pending.length,
		confirmedCount: confirmed.length,
		currentUser: currentUser?.firstName,
	});

	if (loading) {
		return (
			<SafeAreaView className="flex-1 items-center justify-center bg-white">
				<Text>Loading...</Text>
			</SafeAreaView>
		);
	}

	if (error) {
		return (
			<SafeAreaView className="flex-1 items-center justify-center bg-white">
				<Text>Error fetching sessions: {error}</Text>
			</SafeAreaView>
		);
	}

	const onSessionPress = (session: EnrichedSession) => {
		handleExpandSession(session);
	};

	const handleSelectPSW = async (pswId: string, pswData: any) => {
		// TODO: Call backend API to select this PSW
		// PATCH /sessions/:sessionId/candidates/:pswId/select
		console.log('Selected PSW:', pswId, pswData);
	};

	const SessionApplicationCard = ({
		session,
	}: {
		session: EnrichedSession;
	}) => {
		const { data: applications, isLoading: applicationsLoading } =
			useSessionApplications(session.id);
		const displayInfo = getSessionDisplayInfo(session, currentUser!);
		const [isExpanded, setIsExpanded] = useState(false);

		const toggleExpanded = () => {
			setIsExpanded(!isExpanded);
		};

		return (
			<View className="mb-6">
				{/* Session Info Card - Always Visible */}
				<TouchableOpacity
					onPress={toggleExpanded}
					className="bg-white rounded-xl p-4"
					style={{
						marginBottom: isExpanded ? 4 : 0,
					}}
				>
					{/* Top Row: Session Title and Profile Pictures */}
					<View className="flex-row items-center justify-between">
						<View className="flex-1">
							<Text className="text-lg font-semibold text-gray-900">
								Thurs, 7 pm - 11 pm
							</Text>
							<View className="flex-row items-center mt-1">
								<Text className="text-sm text-gray-600">
									{displayInfo.primaryName},{' '}
									{session.careRecipient?.address?.city ||
										session.otherUser?.address?.city ||
										'Toronto'}
									,{' '}
									{session.careRecipient?.address?.province ||
										session.otherUser?.address?.province ||
										'ON'}
								</Text>
								<Ionicons
									name="checkmark-circle"
									size={16}
									color="#1A8BF8"
									style={{ marginLeft: 4 }}
								/>
							</View>
						</View>

						{/* Profile Pictures Preview - Top Right */}
						{applications && applications.length > 0 && (
							<View className="flex-row ml-4">
								{applications
									.slice(0, 3)
									.map((applicant: any, index: number) => (
										<Image
											key={
												applicant.userId ||
												applicant.pswId ||
												index
											}
											source={
												applicant.photoUrl
													? {
															uri: applicant.photoUrl,
														}
													: require('@/assets/default-profile.png')
											}
											className="w-8 h-8 rounded-full border-2 border-white"
											style={{
												marginLeft: index > 0 ? -8 : 0,
												zIndex:
													applications.length - index,
											}}
										/>
									))}
								{applications.length > 3 && (
									<View
										className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white items-center justify-center"
										style={{
											marginLeft: -8,
											zIndex: 0,
										}}
									>
										<Text className="text-xs text-gray-600 font-semibold">
											+{applications.length - 3}
										</Text>
									</View>
								)}
							</View>
						)}
					</View>

					{/* Separator Line */}
					{applications && applications.length > 0 && (
						<View className="border-t border-gray-200 mt-3 pt-3">
							<View className="flex-row items-center">
								<Text className="text-sm text-gray-600 mr-2">
									New Responses
								</Text>
								<View className="bg-red-500 rounded-full w-5 h-5 items-center justify-center">
									<Text className="text-white text-xs font-bold">
										{applications.length}
									</Text>
								</View>
							</View>
						</View>
					)}

					{/* No applicants case */}
					{(!applications || applications.length === 0) &&
						!applicationsLoading && (
							<View className="border-t border-gray-200 mt-3 pt-3">
								<Text className="text-sm text-gray-500">
									No applicants yet
								</Text>
							</View>
						)}
				</TouchableOpacity>

				{/* PSW Applicants List - Expanded View */}
				{isExpanded && (
					<View className="bg-white rounded-xl overflow-hidden">
						{applicationsLoading ? (
							<View className="p-4 items-center">
								<ActivityIndicator
									size="small"
									color="#1A8BF8"
								/>
							</View>
						) : applications && applications.length > 0 ? (
							<>
								{applications.map(
									(applicant: any, index: number) => (
										<TouchableOpacity
											key={
												applicant.userId ||
												applicant.pswId ||
												index
											}
											onPress={() =>
												handleSelectPSW(
													applicant.userId ||
														applicant.pswId,
													applicant,
												)
											}
											className={`flex-row items-center px-4 py-3 ${
												index < applications.length - 1
													? 'border-b border-gray-100'
													: ''
											}`}
										>
											<Image
												source={
													applicant.photoUrl
														? {
																uri: applicant.photoUrl,
															}
														: require('@/assets/default-profile.png')
												}
												className="w-12 h-12 rounded-full mr-3"
											/>
											<View className="flex-1">
												<Text className="text-base font-semibold text-gray-900">
													{applicant.firstName}{' '}
													{applicant.lastName?.charAt(
														0,
													)}
													.
												</Text>
												{applicant.specialties &&
													applicant.specialties
														.length > 0 && (
														<Text className="text-sm text-gray-600 mt-0.5">
															{applicant.specialties.join(
																', ',
															)}
														</Text>
													)}
												{applicant.distance && (
													<Text className="text-xs text-gray-500 mt-0.5">
														{applicant.distance}
													</Text>
												)}
											</View>
											<View className="items-end">
												{applicant.hourlyRate && (
													<Text className="text-sm font-semibold text-gray-900">
														${applicant.hourlyRate}
														/hr
													</Text>
												)}
												<Ionicons
													name="chevron-forward"
													size={20}
													color="#999"
													style={{ marginTop: 2 }}
												/>
											</View>
										</TouchableOpacity>
									),
								)}
							</>
						) : (
							<View className="p-6 items-center">
								<Ionicons
									name="people-outline"
									size={48}
									color="#D1D5DB"
								/>
								<Text className="text-gray-500 mt-3">
									No applicants yet
								</Text>
							</View>
						)}
					</View>
				)}
			</View>
		);
	};

	const renderAllNewRequestSessions = () => {
		if (!currentUser || newRequests.length === 0) return null;

		return (
			<View>
				<Text className="text-xl text-black font-medium mb-3">New</Text>
				{newRequests.map((session) => (
					<SessionApplicationCard
						key={session.id}
						session={session}
					/>
				))}
			</View>
		);
	};

	return (
		<SafeAreaView
			className="flex-1"
			style={{
				backgroundColor: '#F2F2F7',
				paddingTop: LAYOUT_CONSTANTS.SCREEN_TOP_PADDING,
			}}
		>
			<View className="flex-row items-center px-[15px] border-b border-[#79797966] pb-4 mb-[10px]">
				<Ionicons
					name="time"
					size={26}
					color="black"
					style={{ marginRight: 8 }}
				/>
				<Text className="text-xl text-black font-medium">
					My Sessions
				</Text>
			</View>

			<ScrollView
				contentContainerStyle={{
					paddingBottom:
						LAYOUT_CONSTANTS.getContentBottomPadding(
							!!activeLiveSession,
						),
				}}
			>
				<View className="flex-1 px-3.5">
					{/* New design with applications at top */}
					{newRequests.length > 0 ? (
						renderAllNewRequestSessions()
					) : (
						<SessionList
							sessions={newRequests}
							onSessionPress={onSessionPress}
							isNewRequestsSection={true}
						/>
					)}

					<SessionList
						sessions={pending}
						onSessionPress={onSessionPress}
						title="Pending"
					/>

					<SessionBookedList
						sessions={confirmed}
						onSessionPress={onSessionPress}
						title="Booked"
					/>
				</View>
			</TouchableOpacity>
		</SafeAreaView>
	);
};

export default SeekerSessionsTab;
