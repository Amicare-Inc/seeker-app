import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { doc, setDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebase.config";
import { router, useLocalSearchParams } from "expo-router";
import { User } from "@/types/User";

const RequestSession = () => {
  const { targetUser, requesterId } = useLocalSearchParams();
  const targetUserObj: User = JSON.parse(targetUser as string);
  console.log("TARGET USER: ", targetUserObj);
  const [helpText, setHelpText] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [pickerTarget, setPickerTarget] = useState<"start" | "end">("start");

  const currentUser = FIREBASE_AUTH.currentUser;

  if (targetUserObj.isPsw) {
    const basePrice = targetUserObj.rate? targetUserObj.rate : 20;
  }
  else {
    const basePrice = 156;
  }
  const basePrice = 156;
  const taxes = 24.2;
  const serviceFee = 40;
  const total = basePrice + taxes + serviceFee;

  const showDatePicker = (target: "start" | "end", mode: "date" | "time") => {
    setPickerTarget(target);
    setPickerMode(mode);
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (selectedDate: Date) => {
    if (pickerTarget === "start") {
      setStartDate(selectedDate);
    } else {
      setEndDate(selectedDate);
    }
    hideDatePicker();
  };

  const handleSubmit = async () => {
    
    if (!currentUser) {
      alert("You must be signed in to send a request.");
      return;
    }

    if (!helpText.trim()) {
      alert("Please specify what you need help with.");
      return;
    }

    if (!startDate || !endDate) {
      alert("Please select both start and end times.");
      return;
    }

    try {
      const sessionId = `${currentUser.uid}_${Date.now()}`;
      const sessionData = {
        id: sessionId,
        requesterId: currentUser.uid,
        targetUserId: targetUserObj.id,
        status: "pending",
        note: helpText,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        billingDetails: {
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
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderBottomWidth: 1,
          borderBottomColor: "#ddd",
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={{ fontSize: 18, color: "blue" }}>{"< Back"}</Text>
        </TouchableOpacity>
        <Text
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          Request Session
        </Text>
      </View>

      <View style={{ padding: 16 }}>
        {/* Help Text Input */}
        <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 8 }}>
          I need help with:
        </Text>
        <TextInput
          value={helpText}
          onChangeText={setHelpText}
          placeholder="E.g., Elderly care, wound care"
          style={{
            fontSize: 14,
            padding: 12,
            borderWidth: 1,
            borderColor: "#ddd",
            borderRadius: 8,
            marginBottom: 20,
          }}
        />

        {/* Start Date and Time */}
        <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 8 }}>
          Starts:
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => showDatePicker("start", "date")}
            style={{
              flex: 1,
              marginRight: 8,
              padding: 12,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text>
              {startDate ? startDate.toLocaleDateString() : "Select Date"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => showDatePicker("start", "time")}
            style={{
              flex: 1,
              padding: 12,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text>
              {startDate
                ? startDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Select Time"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* End Date and Time */}
        <Text style={{ fontSize: 14, fontWeight: "bold", marginBottom: 8 }}>
          Ends:
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => showDatePicker("end", "date")}
            style={{
              flex: 1,
              marginRight: 8,
              padding: 12,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text>
              {endDate ? endDate.toLocaleDateString() : "Select Date"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => showDatePicker("end", "time")}
            style={{
              flex: 1,
              padding: 12,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              alignItems: "center",
            }}
          >
            <Text>
              {endDate
                ? endDate.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Select Time"}
            </Text>
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode={pickerMode}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />

        {/* Billing Info */}
        <View
          style={{
            backgroundColor: "#f9f9f9",
            padding: 16,
            borderRadius: 8,
            marginBottom: 20,
          }}
        >
          <Text style={{ fontSize: 14 }}>Base Price: ${basePrice}</Text>
          <Text style={{ fontSize: 14 }}>Taxes: ${taxes}</Text>
          <Text style={{ fontSize: 14 }}>Service Fee: ${serviceFee}</Text>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginTop: 8,
            }}
          >
            Total: ${total}
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={{
            backgroundColor: "#007bff",
            borderRadius: 8,
            padding: 16,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>
            Send Request
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RequestSession;