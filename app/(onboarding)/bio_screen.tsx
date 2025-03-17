import React, { useState } from 'react';
import { SafeAreaView, ScrollView, View, Text, Alert } from 'react-native';
import CustomButton from '@/components/CustomButton';
import ForumField from '@/components/ForumField'; // Reusing your ForumField component
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { updateUserFields } from '@/redux/userSlice';
import { FIREBASE_DB } from '@/firebase.config';
import { doc, setDoc } from 'firebase/firestore';
import { router } from 'expo-router';

const BioScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userData = useSelector((state: RootState) => state.user.userData);
  const [bio, setBio] = useState(userData?.bio || '');

  const handleFinish = async () => {
    try {
      // 1️⃣ Update Redux
      dispatch(updateUserFields({ bio }));

      // 2️⃣ Update Firebase
      if (userData?.id) {
        await setDoc(doc(FIREBASE_DB, 'test1', userData.id), { ...userData, onboardingComplete: true, bio: bio }, { merge: true });
        Alert.alert('Success', 'Your profile has been created successfully!');
      }

      // 3️⃣ Navigate to the Home Screen or any other final page
    const nextRoute = userData?.isPsw ? '/(psw)/psw-home' : '/(seeker)/seeker-home';
    console.log('Navigating to:', nextRoute);
    router.push(nextRoute);
    } catch (error) {
      console.error('Error saving bio:', error);
      Alert.alert('Error', 'There was an issue saving your bio. Please try again.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 20 }}>
        <Text className="text-3xl text-black font-normal mb-3 text-center">Add a Bio</Text>
        <Text className="text-sm text-gray-500 font-normal mb-6 text-center">
          Tell us more about yourself. This is optional and you can skip if you’d like.
        </Text>

        <ForumField
          title="Write something about yourself..."
          value={bio}
          handleChangeText={(text) => setBio(text)}
          otherStyles="mb-6 h-40 bg-gray-100 p-4 rounded-xl"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
        />
      </ScrollView>

      <View className="px-9 w-full">
        <CustomButton
          title="Finish"
          handlePress={handleFinish}
          containerStyles="bg-black py-4 rounded-full"
          textStyles="text-white text-lg"
        />
      </View>
    </SafeAreaView>
  );
};

export default BioScreen;