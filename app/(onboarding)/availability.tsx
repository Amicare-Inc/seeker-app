import React, { useState } from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import CustomButton from "@/components/CustomButton";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebase.config";
import { doc, setDoc } from "firebase/firestore";
import { router } from "expo-router";

const AvailabilityPage: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<{ [day: string]: string[] }>({});
  const [activeDay, setActiveDay] = useState<string | null>(null);

  const timeslots = [
    "6 am - 9 am",
    "9 am - 12 pm",
    "12 pm - 3 pm",
    "3 pm - 6 pm",
    "6 pm - 9 pm",
    "9 pm - 12 am",
    "12 am - 3 am",
    "3 am - 6 am",
  ];

  const days = ["Mon", "Tues", "Weds", "Thurs", "Fri", "Sat", "Sun"];

  const handleDayToggle = (day: string) => {
    setActiveDay(activeDay === day ? null : day);
  };

  const handleTimeToggle = (time: string) => {
    if (!activeDay) return;

    setSelectedDays((prev) => {
      const times = prev[activeDay] || [];
      const updatedTimes = times.includes(time)
        ? times.filter((t) => t !== time)
        : [...times, time];

      const updatedDays = { ...prev, [activeDay]: updatedTimes };

      if (updatedTimes.length === 0) {
        delete updatedDays[activeDay];
      }

      return updatedDays;
    });
  };

  const handleReset = () => {
    setSelectedDays({});
    setActiveDay(null);
  };

  const handleSave = async () => {
    const currentUser = FIREBASE_AUTH.currentUser;
    if (!currentUser) return;

    try {
      const userDocRef = doc(FIREBASE_DB, "personal", currentUser.uid);
      await setDoc(userDocRef, { availability: selectedDays }, { merge: true });
      router.push("/personal_details");
    } catch (error) {
      console.error("Error saving availability:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}>
        <View className="p-6">
          {/* Days Section */}
          <Text className="text-lg font-bold text-black mb-4">
            On which days do you usually need care? Select all that apply:
          </Text>
          <View className="flex-wrap flex-row justify-between mb-6">
            {days.map((day) => (
              <CustomButton
                key={day}
                title={day}
                handlePress={() => handleDayToggle(day)}
                containerStyles={`w-[22%] py-4 rounded-full ${
                  selectedDays[day]?.length ? "bg-blue-500" : "bg-gray-200"
                }`}
                textStyles={`text-sm ${
                  selectedDays[day]?.length ? "text-white" : "text-black"
                }`}
              />
            ))}
            {/* Reset Button */}
            <CustomButton
              title="Reset"
              handlePress={handleReset}
              containerStyles="w-[22%] py-4 bg-red-500 rounded-full"
              textStyles="text-sm text-white"
            />
          </View>

          {/* Time Slots Section */}
          {activeDay && (
            <>
              <Text className="text-lg font-bold text-black mb-4">
                At roughly what times do you need care for {activeDay}? Select all that apply:
              </Text>
              <View className="flex-wrap flex-row justify-between">
                {timeslots.map((time) => (
                  <CustomButton
                    key={time}
                    title={time}
                    handlePress={() => handleTimeToggle(time)}
                    containerStyles={`w-[48%] mb-4 py-4 rounded-full ${
                      selectedDays[activeDay]?.includes(time)
                        ? "bg-blue-500"
                        : "bg-gray-200"
                    }`}
                    textStyles={`text-sm ${
                      selectedDays[activeDay]?.includes(time) ? "text-white" : "text-black"
                    }`}
                  />
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Save Button */}
      <View className="p-6">
        <CustomButton
          title="Done"
          handlePress={handleSave}
          containerStyles="w-full bg-black py-4 rounded-full"
          textStyles="text-white text-lg"
        />
      </View>
    </SafeAreaView>
  );
};

export default AvailabilityPage;