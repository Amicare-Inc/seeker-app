import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { User } from "@/types/User";

interface UserCardExpandedProps {
  user: User;
  onPress: () => void;
}

const UserCardExpanded: React.FC<UserCardExpandedProps> = ({ user, onPress }) => {

  // console.log("UserCardExpanded: ", user.isPSW);
  /// NEED TO FIX isPSW vs isPsw in User type and UserCardExpanded.tsx ^^^^^

  const joinWithPeriod = (array?: string[]) => {
    return array && array.length > 0 ? array.join(". ") : "Not provided";
  };

    return (
        <TouchableOpacity onPress={onPress} className="bg-white rounded-lg p-5 mb-1 shadow-lg">
        {/* Header with User Image, Name, and Rate */}
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Image
              source={{ uri: user.profilePhotoUrl || "https://via.placeholder.com/50" }} // Placeholder image URL
              className="w-16 h-16 rounded-full mr-4"
            />
            <View>
              <Text className="font-bold text-xl">{`${user.firstName} ${user.lastName}`}</Text>
              <Text className="text-gray-500 text-sm">[Rating]</Text>
            </View>
          </View>
          <Text className="font-bold text-xl text-blue-600">${`${user.isPsw? (user.rate? user.rate: 20) : ""}`}</Text>
        </View>
  
        {/* Bio Section */}
        <Text className="font-bold text-gray-800 mb-2">Bio</Text>
        <Text className="text-gray-600 mb-4">
          {user.bio || `[Summary]Hello, my name is ${user.firstName}. I've provided personalized care to elders with dementia, cancer and diabetes. I focus on providing a foundation of personal support fostering confidence in the elderly.`}
        </Text>
  
        {/* Skill Sets */}
        <Text className="font-bold text-gray-800 mb-2">My skill sets</Text>
        <Text className="text-gray-600 mb-4">
          {joinWithPeriod(user.carePreferences?.tasks) || `[Skills]Housekeeping. Accompaniment to Medical appointments. Wound care. Meal preparation.`}
        </Text>
  
        {/* Diagnosed Conditions Section */}
        <Text className="font-bold text-gray-800 mb-2">Diagnosed conditions I have cared for</Text>
        <Text className="text-gray-600 mb-4">
          {joinWithPeriod(user.carePreferences?.careType) || `[Conditions]Dementia. Cancer. Diabetes`}
        </Text>
  
        {/* Languages and Location */}
        <View className="flex-row justify-between mt-4">
          <View className="flex-1 mr-2">
            <Text className="font-bold text-gray-800 mb-1">Languages</Text>
            <Text className="text-gray-600">[Languages]</Text>
          </View>
          <View className="flex-1 ml-2">
            <Text className="font-bold text-gray-800 mb-1">Location</Text>
            <Text className="text-gray-600">{user.address || `[Distance]`}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
};

export default UserCardExpanded;