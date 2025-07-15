// @/components/User/UserCardSeeker.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { User } from '@/types/User';
import Ionicons from '@expo/vector-icons/Ionicons';

interface UserCardSeekerProps {
    user: User;
    onPress: () => void;
    familyMembers?: User[]; // Additional family members for multiple profile pics
    additionalMembersCount?: number; // For showing +1
}

const UserCardSeeker: React.FC<UserCardSeekerProps> = ({ 
    user, 
    onPress, 
    familyMembers = [], 
    additionalMembersCount = 0 
}) => {
    const locationText = user.address?.city && user.address?.province 
        ? `${user.address.city}, ${user.address.province}` 
        : 'Burlington, Toronto';

    // Check if user has family members from the user's familyMembers array
    const hasFamilyMembers = user.familyMembers && user.familyMembers.length > 0;
    const firstFamilyMember = hasFamilyMembers ? user.familyMembers![0] : null;

    // Show family member name if exists, otherwise show core user name
    const displayName = firstFamilyMember 
        ? `${firstFamilyMember.firstName} ${firstFamilyMember.lastName?.[0]}.`
        : `${user.firstName} ${user.lastName?.[0]}.`;

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-lg p-[14px] pl-[20px] mb-[12px] pr-[42px]"
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-1">
                    <View className="flex-row items-center">
                        <Text className="font-bold text-lg text-black mr-1">
                            {displayName}
                        </Text>
                        
                        <View className="w-[15px] h-[15px] bg-blue-500 rounded-full items-center justify-center mr-2">
                            <Ionicons name="checkmark" size={10} color="white" />
                        </View>

                        {hasFamilyMembers && (
                            <Text className="text-sm text-grey-58">
                                +{user.familyMembers?.length || 0}
                            </Text>
                        )}
                    </View>
                    
                    <Text className="text-sm font-medium text-gray-500">
                        {locationText}
                    </Text>
                </View>

                <View className="relative">
                    {/* Core user photo (behind) */}
                    {hasFamilyMembers && (
                        <Image
                            source={{
                                uri: user.profilePhotoUrl || 'https://via.placeholder.com/58',
                            }}
                            className="w-[58px] h-[58px] rounded-full absolute"
                            style={{
                                right: -35,
                            }}
                        />
                    )}
                    
                    {/* Family member photo (in front) or core user photo if no family */}
                    <Image
                        source={{
                            uri: firstFamilyMember?.profilePhotoUrl || user.profilePhotoUrl || 'https://via.placeholder.com/58',
                        }}
                        className="w-[58px] h-[58px] rounded-full border-2 border-brand-blue"
                        style={{
                            transform: [{ translateX: hasFamilyMembers ? 0 : 30 }]
                        }}
                    />
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default UserCardSeeker;
