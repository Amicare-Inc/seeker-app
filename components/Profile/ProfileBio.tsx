// @/components/Profile/ProfileBio.tsx
import React from "react";
import { View, Text } from "react-native";

interface ProfileBioProps {
  bio?: string;
}

/**
 * A simple bio section, left-aligned, with smaller font size
 * and relaxed line height for a paragraph-like look.
 */
const ProfileBio: React.FC<ProfileBioProps> = ({ bio }) => {
  if (!bio) return null;

  return (
    <View className="mb-4">
      <Text className="text-sm text-gray-800 leading-5">
        {bio}
      </Text>
    </View>
  );
};

export default ProfileBio;