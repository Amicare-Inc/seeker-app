// @/components/Profile/ProfileEditPanel.tsx
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { User } from "@/types/User";

interface ProfileEditPanelProps {
  user: User;
}

const ProfileEditPanel: React.FC<ProfileEditPanelProps> = ({ user }) => {
  const isPsw = user.isPsw;
  const bio = user.bio || "No bio provided.";
  const careType = user.carePreferences?.careType?.join(", ") || "Not specified";
  const tasks = user.carePreferences?.tasks?.join(", ") || "Not specified";

  // Set labels based on user type
  const diagnosisLabel = isPsw ? "Experience with" : "Diagnoses";
  const supportLabel = isPsw ? "Assisting with" : "Requiring";

  return (
    <View>
      <Text className="text-base font-bold mb-3">Edit Profile</Text>
      
      {/* Bio Field */}
      <View className="mb-3">
        <Text className="text-sm font-semibold mb-1">Bio</Text>
        <View className="border border-gray-300 rounded-lg p-2">
          <Text className="text-sm text-gray-700">{bio}</Text>
        </View>
      </View>

      {/* Diagnosis / Experience Field */}
      <View className="mb-3">
        <Text className="text-sm font-semibold mb-1">{diagnosisLabel}</Text>
        <View className="border border-gray-300 rounded-lg p-2">
          <Text className="text-sm text-gray-700">{careType}</Text>
        </View>
      </View>

      {/* Seeking Support / Assisting Field */}
      <View>
        <Text className="text-sm font-semibold mb-1">{supportLabel}</Text>
        <View className="border border-gray-300 rounded-lg p-2">
          <Text className="text-sm text-gray-700">{tasks}</Text>
        </View>
      </View>
    </View>
  );
};

export default ProfileEditPanel;