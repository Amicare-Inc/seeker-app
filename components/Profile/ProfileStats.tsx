// @/components/Profile/ProfileStats.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { User } from "@/types/User";

interface ProfileStatsProps {
  user: User;
}

/**
 * Displays two lines:
 * 1) Type of care (provided/interested in)
 * 2) Tasks (assisting by / seeking support with)
 * Both are left-aligned, based on whether user.isPsw is true or false.
 */
const ProfileStats: React.FC<ProfileStatsProps> = ({ user }) => {
  const isPsw = user.isPsw;

  // Determine titles
  const leftTitle = isPsw
    ? "Experience with"
    : "Diagnoses";
  const rightTitle = isPsw ? "Assisting with" : "Requiring";

  // Pull data from user.carePreferences
  const careType = user.carePreferences?.careType?.join(", ") || "N/A";
  const tasks = user.carePreferences?.tasks?.join(", ") || "N/A";

  return (
    <View className="flex-row justify-between mb-4">
      {/* Left column */}
      <View className="flex-1 mr-2">
        <Text className="text-sm font-semibold mb-1">{leftTitle}</Text>
        <Text className="text-sm text-gray-700" style={styles.wrapText}>{careType}</Text>
      </View>

      {/* Right column */}
      <View className="flex-1">
        <Text className="text-sm font-semibold mb-1">{rightTitle}</Text>
        <Text className="text-sm text-gray-700" style={styles.wrapText}>{tasks}</Text>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
    wrapText: {
      flexWrap: "wrap",
    },
  });
  

export default ProfileStats;