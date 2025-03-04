// @/components/Profile/ProfileScreen.tsx
import React from "react";
import { ScrollView, View, Text } from "react-native";
import ProfileHeader from "./ProfileHeader";
import ProfileBio from "./ProfileBio";
import ProfileStats from "./ProfileStats";
import ProfileActionRow from "./ProfileActionRow";
import ProfileListItem from "./ProfileListItem";
import { User } from "@/types/User";
import { SafeAreaView } from "react-native-safe-area-context";

interface ProfileScreenProps {
  user: User;
  isMyProfile: boolean;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, isMyProfile }) => {
  const {
    firstName,
    lastName,
    address,
    bio,
    // placeholders for your “Diagnoses” / “Experience” etc.
  } = user;

  // If it’s my profile, we show certain placeholders (e.g. “Cancer, Dementia” vs “Housekeeping, Mobility”).
  // If it’s another user’s profile, we can swap them or rename them “Experience” / “Skills.”
  // const leftTitle = isMyProfile ? "Diagnoses" : "Experience";
  // const leftSubtitle = isMyProfile ? "Cancer, Dementia" : "Dementia, Cancer";
  // const rightTitle = isMyProfile ? "Seeking support with" : "Skills";
  // const rightSubtitle = isMyProfile ? "Housekeeping, Mobility" : "Housekeeping, Mobility";

  return (
    <SafeAreaView className="flex-1 bg-white px-4 py-6">
    <ProfileHeader
        userName={`${firstName} ${lastName}`}
        userLocation={address || "Midtown, Toronto"}
        userRating="4.8 out of 5"
        userPhoto={user.profilePhotoUrl}
        onMenuPress={() => {}}
      />
    <ScrollView className="flex-1 bg-white">
      {/* <ProfileHeader
        userName={`${firstName} ${lastName}`}
        userLocation={address || "Midtown, Toronto"}
        userRating="4.8 out of 5"
        userPhoto={user.profilePhotoUrl}
        onMenuPress={() => {}}
      /> */}

      <ProfileBio
        bio={
          bio ||
          "Hello, my name is Jane. I am a 60 year old cancer patient seeking support with daily tasks."
        }
      />

      <ProfileStats
        user = {user}
      />

      {/* If it’s my profile, show the row of icons + the list items. */}
      {isMyProfile ? (
        <>
          <ProfileActionRow user={user}/>

          {/* White container for the list items. */}
          <View className="bg-white border border-gray-200 rounded-lg mb-4">
            <ProfileListItem label="Family" iconName="people" disabled />
            <ProfileListItem label="Settings" iconName="settings" />
            <ProfileListItem label="Help" iconName="help-circle" />
            <ProfileListItem label="Refer friends" iconName="gift" disabled />
            <ProfileListItem label="Legal" iconName="document-text" />
          </View>
        </>
      ) : (
        <>
          {/* For another user’s profile, you can show a rate or “reviews” section if you want. */}
          {/* e.g. Rate or reviews placeholder. */}
          <Text className="text-sm text-gray-600 mb-4">
            {/* e.g. “$20/hr” if user.isPsw */}
          </Text>
        </>
      )}
    </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;