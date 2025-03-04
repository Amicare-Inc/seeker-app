// @/components/Profile/ProfileHeader.tsx
import React from "react";
import { SafeAreaView, View, Text, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ProfileHeaderProps {
  userName: string;
  userLocation?: string;
  userRating?: string;       // e.g. "4.8 out of 5"
  userPhoto?: string;
  onMenuPress?: () => void;  // For the "..." icon
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userName,
  userLocation,
  userRating,
  userPhoto,
  onMenuPress,
}) => {
  return (
      <View className="mb-4 flex-row items-center justify-between">
        {/* Left side: Photo + Name/Rating/Location */}
        <View className="flex-row items-center">
          {userPhoto ? (
            <Image
              source={{ uri: userPhoto }}
              className="w-20 h-20 rounded-full mr-3"
            />
          ) : (
            <View className="w-20 h-20 rounded-full bg-gray-300 mr-3" />
          )}
          <View>
            <Text className="text-xl font-bold">{userName}</Text>
            {userRating && (
              <View className="flex-row items-center mt-1">
                <Ionicons name="checkmark-circle" size={16} color="#00BFFF" />
                <Text className="text-sm text-gray-600 ml-1">{userRating}</Text>
              </View>
            )}
            {userLocation && (
              <Text className="text-xs text-gray-500 mt-1">{userLocation}</Text>
            )}
          </View>
        </View>
        {/* Right side: Optional menu icon */}
        <TouchableOpacity onPress={onMenuPress} className="p-2">
          <Ionicons name="ellipsis-horizontal" size={24} color="#000" />
        </TouchableOpacity>
      </View>
  );
};

export default ProfileHeader;