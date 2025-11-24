// @/components/sessions/RequestSession/SessionsCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

import Ionicons from '@expo/vector-icons/Ionicons';
import { EnrichedSession, CareRecipientData } from "@/types/EnrichedSession";
import { formatTimeRange } from "@/lib/datetimes/datetimeHelpers";
interface RequestSessionCardProps {
    session:EnrichedSession; // Main user (can be PSW, self-care seeker, or family manager)
    familyMember?: {
        id: string;
        firstName: string;
        lastName: string;
        profilePhotoUrl?: string;
        address: {
            fullAddress: string;
            street: string;
            city: string;
            province: string;
            country: string;
            postalCode: string;
        };
        carePreferences: {
            careType: string[];
            tasks: string[];
            availability: {
                [days: string]: { start: string; end: string }[];
            };
        };
    }; // Optional family member (for family-care seekers)
    distanceInfo?: {
        distance: string;
        duration: string;
        distanceValue: number;
    };
    onPress: () => void;
}

const RequestSessionCard: React.FC<RequestSessionCardProps> = ({ 
    session, 
    familyMember, 
    distanceInfo, 
    onPress 
}) => {
    // Determine if this is a family member card or user card
    const isForFamilyMember = !!familyMember;
    
    // Get the relevant data based on card type
    const displayName = isForFamilyMember 
        ? `${session.careRecipient?.firstName} ${session.careRecipient?.lastName}`
        : `${session.otherUser?.firstName} ${session.otherUser?.lastName}`;
        
    const profilePhoto = isForFamilyMember 
        ? session.careRecipient?.profilePhotoUrl 
        : session.otherUser?.profilePhotoUrl;
        
    const address = isForFamilyMember 
        ? session.careRecipient?.address 
        : session.otherUser?.address;
    
    const locationText = address?.city && address?.province 
        ? `${address.city}, ${address.province}` 
        : 'Burlington, Toronto';


    const startDate = session.startTime;
    const endDate = session.endTime;

    const tasks = session.checklist?.map((task) => task.task).join(', ');

    // Date/Time display like: "Mon. 03:00 pm - 11:00 pm"
    const weekday = startDate
        ? new Date(startDate).toLocaleDateString('en-US', { weekday: 'short' })
        : undefined;
    const timeRange = startDate && endDate ? formatTimeRange(startDate, endDate) : undefined;
    const dayTimeDisplay = weekday && timeRange ? `${weekday}. ${timeRange}` : undefined;

    // Name, rate, distance string: "Jane, $25/hr, 5 km away"
    // const rate = session.otherUser?.rate;
    const distance =  session.distanceInfo?.distance;
    const metaLineParts = [
        displayName,
        // typeof rate === 'number' ? `$${rate}/hr` : undefined,
        distance ? `${distance} away` : undefined,
    ].filter(Boolean) as string[];
    const metaLine = metaLineParts.join(', ');

    // Show distance info if available, otherwise show care type info
    const rightSideContent = distanceInfo ? (
        <View className="items-end">
            <Text className="text-sm font-medium text-gray-900">
                {distanceInfo.distance}
            </Text>
            <Text className="text-xs text-gray-500">
                {distanceInfo.duration}
            </Text>
        </View>
    ) : (
        <View className="w-[15px] h-[15px] bg-blue-500 rounded-full items-center justify-center">
            <Ionicons name="checkmark" size={10} color="white" />
        </View>
    );

    const remoteUserVerified = session.otherUser?.idManualVerified ?? false;

    return (
            <TouchableOpacity
            onPress={onPress}
                className="bg-white rounded-lg p-[14px] pl-[20px] mb-[12px] pr-[42px]"
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        {dayTimeDisplay && (
                            <Text className="font-bold text-base text-black" numberOfLines={1}>
                                {dayTimeDisplay}
                            </Text>
                        )}

                        <View className="flex-row items-center mt-[2px]">
                            <Text className="text-sm font-medium text-gray-700 mr-1 flex-shrink" numberOfLines={1}>
                                {metaLine}
                            </Text>
                            {remoteUserVerified && (
                                <Ionicons name="checkmark-circle" size={16} color="#3B82F6" />
                            )}
                        </View>

                        {tasks && (
                            <Text className="text-xs text-gray-500 mt-[6px]" numberOfLines={1}>
                                {tasks}
                            </Text>
                        )}
                    </View>

                    <View className="relative">
                        {/* Core user photo (behind) - always show for family member cards */}
                        {isForFamilyMember && (
                            <Image
                                source={
                                    session.otherUser?.profilePhotoUrl
                                        ? { uri: session.otherUser?.profilePhotoUrl }
                                        : require('@/assets/default-profile.png')
                                }
                                className="w-[58px] h-[58px] rounded-full absolute"
                                style={{
                                    right: -35,
                                    zIndex: 1
                                }}
                            />
                        )}
                        
                        {/* Family member or self photo (in front) */}
                        <Image
                            source={
                                profilePhoto
                                    ? { uri: profilePhoto }
                                    : require('@/assets/default-profile.png')
                            }
                            className="w-[58px] h-[58px] rounded-full border-2 border-brand-blue"
                            style={{
                                transform: [{ translateX: isForFamilyMember ? 0 : 30 }],
                                zIndex: 2
                            }}
                        />
                    </View>
                </View>
            </TouchableOpacity>
    );
};

export default RequestSessionCard;