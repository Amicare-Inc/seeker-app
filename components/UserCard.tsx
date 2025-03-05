// @/components/UserCard.tsx
import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { User } from "@/types/User";

interface UserCardProps {
  user: User;
  onPress: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
  const locationText = user.address || "Toronto, ON";
  const rate = user.rate || 20;

  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-lg p-4 mb-4"
      // Removed shadow styling for a cleaner card look.
    >
      <View className="flex-row items-center">
        <Image
          source={{ uri: user.profilePhotoUrl || "https://via.placeholder.com/50" }}
          // Increase profile image to 20x20 and use rounded corners.
          className="w-20 h-20 rounded-lg mr-4"
        />
        <View className="flex-1">
          <Text className="font-semibold text-base text-black">
            {user.firstName} {user.lastName}
          </Text>
          <Text className="text-sm text-gray-500">{locationText}</Text>
        </View>
        <Text className="font-semibold text-base text-black">${rate}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default UserCard;