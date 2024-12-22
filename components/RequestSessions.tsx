import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebase.config";
import { router, useLocalSearchParams } from "expo-router";

const RequestSession = () => {
  const { targetUserId, requesterId } = useLocalSearchParams();
  const [helpText, setHelpText] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const basePrice = 156;
  const taxes = 24.2;
  const serviceFee = 40;
  const total = basePrice + taxes + serviceFee;

  const handleSubmit = async () => {
    const currentUser = FIREBASE_AUTH.currentUser;

    if (!currentUser) {
      alert("You must be signed in to send a request.");
      return;
    }

    if (!helpText.trim()) {
      alert("Please specify what you need help with.");
      return;
    }

    try {
      const sessionId = `${currentUser.uid}_${Date.now()}`;
      const sessionData = {
        id: sessionId,
        requesterId: currentUser.uid,
        targetUserId: targetUserId, // Replace with the target user's ID
        status: "pending",
        note: helpText,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        billing: {
          basePrice,
          taxes,
          serviceFee,
          total,
        },
      };

      await setDoc(doc(FIREBASE_DB, "sessions", sessionId), sessionData);

      alert("Session request sent successfully!");
      router.back();
    } catch (error) {
      console.error("Error submitting session request:", error);
      alert("An error occurred while sending your request.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-6">
        {/* Header */}
        <Text className="text-2xl font-bold mb-6">Request Sessions</Text>

        {/* Help Text Input */}
        <Text className="text-lg font-bold mb-2">I need help with:</Text>
        <TextInput
          value={helpText}
          onChangeText={setHelpText}
          placeholder="E.g., Elderly care, wound care"
          className="border border-gray-300 rounded-md p-4 mb-6 bg-white"
        />

        {/* Start Date and Time */}
        <Text className="text-lg font-bold mb-2">Starts:</Text>
        <View className="flex-row items-center justify-between border border-gray-300 rounded-md p-4 mb-6 bg-white">
          <TouchableOpacity
            onPress={() => setShowStartDatePicker(true)}
            className="flex-1 mr-2"
          >
            <Text className="text-black">{startDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowStartTimePicker(true)}
            className="flex-1"
          >
            <Text className="text-black">{startDate.toLocaleTimeString()}</Text>
          </TouchableOpacity>
        </View>
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowStartDatePicker(false);
              if (date) setStartDate(new Date(date.setHours(startDate.getHours(), startDate.getMinutes())));
            }}
          />
        )}
        {showStartTimePicker && (
          <DateTimePicker
            value={startDate}
            mode="time"
            display="default"
            onChange={(event, time) => {
              setShowStartTimePicker(false);
              if (time) setStartDate(new Date(startDate.setHours(time.getHours(), time.getMinutes())));
            }}
          />
        )}

        {/* End Date and Time */}
        <Text className="text-lg font-bold mb-2">Ends:</Text>
        <View className="flex-row items-center justify-between border border-gray-300 rounded-md p-4 mb-6 bg-white">
          <TouchableOpacity
            onPress={() => setShowEndDatePicker(true)}
            className="flex-1 mr-2"
          >
            <Text className="text-black">{endDate.toLocaleDateString()}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowEndTimePicker(true)}
            className="flex-1"
          >
            <Text className="text-black">{endDate.toLocaleTimeString()}</Text>
          </TouchableOpacity>
        </View>
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowEndDatePicker(false);
              if (date) setEndDate(new Date(date.setHours(endDate.getHours(), endDate.getMinutes())));
            }}
          />
        )}
        {showEndTimePicker && (
          <DateTimePicker
            value={endDate}
            mode="time"
            display="default"
            onChange={(event, time) => {
              setShowEndTimePicker(false);
              if (time) setEndDate(new Date(endDate.setHours(time.getHours(), time.getMinutes())));
            }}
          />
        )}

        {/* Billing Info */}
        <View className="bg-gray-100 p-4 rounded-md mb-6">
          <Text className="text-base">Base Price: ${basePrice}</Text>
          <Text className="text-base">Taxes: ${taxes}</Text>
          <Text className="text-base">Service Fee: ${serviceFee}</Text>
          <Text className="text-lg font-bold mt-2">Total: ${total}</Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-blue-500 py-4 rounded-md"
        >
          <Text className="text-white font-bold text-center text-lg">
            Send Request
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RequestSession;