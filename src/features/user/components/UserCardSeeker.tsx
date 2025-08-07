// @/components/User/UserCardSeeker.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { User } from '@/types/User';
import Ionicons from '@expo/vector-icons/Ionicons';

interface UserCardSeekerProps {
    user: User; // Main user (can be PSW, self-care seeker, or family manager)
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

const UserCardSeeker: React.FC<UserCardSeekerProps> = ({ 
    user, 
    familyMember, 
    distanceInfo, 
    onPress 
}) => {
    // Determine if this is a family member card or user card
    const isForFamilyMember = !!familyMember;
    
    // Get the relevant data based on card type
    const displayName = isForFamilyMember 
        ? `${familyMember.firstName} ${familyMember.lastName}`
        : `${user.firstName} ${user.lastName}`;
        
    const profilePhoto = isForFamilyMember 
        ? familyMember.profilePhotoUrl 
        : user.profilePhotoUrl;
        
    const address = isForFamilyMember 
        ? familyMember.address 
        : user.address;
    
    const locationText = address?.city && address?.province 
        ? `${address.city}, ${address.province}` 
        : 'Burlington, Toronto';

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

    const remoteUserVerified = user.idManualVerified ?? false;

    return (
            <TouchableOpacity
            onPress={onPress}
                className="bg-white rounded-lg p-[14px] pl-[20px] mb-[12px] pr-[42px]"
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                        <View className="flex-row items-center">
                            <View className="flex-row items-center">
                            <Text className="font-bold text-lg text-black mr-1 flex-shrink">
                                    {displayName}
                                </Text>
                                {remoteUserVerified && (
                                    <Ionicons name="checkmark-circle" size={16} color="#3B82F6" />
                                )}
                            </View>
                        </View>
                        
                    <Text className="text-sm font-medium text-gray-500">
                            {locationText}
                        </Text>
                    </View>

                    <View className="relative">
                        {/* Core user photo (behind) - always show for family member cards */}
                        {isForFamilyMember && (
                            <Image
                                source={
                                    user.profilePhotoUrl
                                        ? { uri: user.profilePhotoUrl }
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

export default UserCardSeeker;
