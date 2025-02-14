import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { User } from "@/types/User";

interface UserCardProps {
  user: User;
  onPress: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-gray-100 rounded-lg p-4 mb-4 flex-row items-center"
    >
      <Image
        source={{ uri: user.profilePhotoUrl || "https://via.placeholder.com/50" }} // Placeholder image URL
        className="w-12 h-12 rounded-full mr-4"
      />
      <View className="flex-1">
        <Text className="font-bold text-lg">{`${user.firstName} ${user.lastName}`}</Text>
        <Text className="text-gray-500">[Rating]</Text>
      </View>
      <Text className="font-bold text-lg">${`${user.isPsw? (user.rate? user.rate: 20) : ""}`}</Text>
    </TouchableOpacity>
  );
};

export default UserCard;