import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { FIREBASE_AUTH, FIREBASE_DB } from "@/firebase.config";
import { useLocalSearchParams, router } from "expo-router";
import { User } from "@/types/User";
import RequestSessionHeader from "@/components/RequestSession/RequestSessionHeader";
import DateTimeRow from "@/components/RequestSession/DateTimeRow";
import SessionLengthSelector from "@/components/RequestSession/SessionLengthSelector";
import BillingCard from "@/components/RequestSession/BillingCard";
import HelpOptionsDropdown from "@/components/RequestSession/HelpOptionsDropdown";
import { mergeDateAndTime, roundDateTo15Min, enforceTwoHourBuffer } from "@/scripts/dateHelpers";
import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";

interface SessionData {
  id: string;
  senderId: string;
  receiverId: string;
  participants: string[];
  status: string;
  createdAt: string;
  confirmedBy: string[];
  note?: string;
  startTime?: string;
  endTime?: string;
  billingDetails?: {
    basePrice: number;
    taxes: number;
    serviceFee: number;
    total: number;
  };
}

const RequestSession = () => {
  const { otherUserId, sessionObj } = useLocalSearchParams();
  const targetUserObj: User = useSelector((state: RootState) => state.userList.users.find((user) => user.id === otherUserId) as User);
  const existingSession: SessionData | null = sessionObj ? JSON.parse(sessionObj as string) : null;

  const [helpText, setHelpText] = useState<string>(existingSession?.note || "");
  const [startDate, setStartDate] = useState<Date | null>(
    existingSession?.startTime ? new Date(existingSession.startTime) : null
  );
  const [endDate, setEndDate] = useState<Date | null>(
    existingSession?.endTime ? new Date(existingSession.endTime) : null
  );
  // Session length in hours.
  const [sessionLength, setSessionLength] = useState<number>(0);

  // For date/time picker.
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [pickerMode, setPickerMode] = useState<"date" | "time">("date");
  const [pickerTarget, setPickerTarget] = useState<"start" | "end">("start");

  const currentUser = useSelector((state: RootState) => state.user.userData);

  const pswRate =
    currentUser?.isPsw
      ? currentUser.rate || 20
      : targetUserObj.isPsw
      ? targetUserObj.rate || 20
      : 20; // fallback default rate

  // The dynamic base price is computed as the PSW rate multiplied by the session length.
  const dynamicBasePrice = pswRate * sessionLength;
  // Fixed additional costs.
  const taxes = dynamicBasePrice * 0.13;
  const serviceFee = dynamicBasePrice * 0.1;
  const total = dynamicBasePrice + taxes + serviceFee;
  // ------------------------------------

  // On mount, compute session length if startDate and endDate exist.
  useEffect(() => {
    if (startDate && endDate) {
      const diffMs = endDate.getTime() - startDate.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);
      setSessionLength(Math.max(diffHours, 0));
    }
  }, []);

  // Recompute endDate when sessionLength changes.
  useEffect(() => {
    if (startDate && sessionLength > 0) {
      const newEnd = new Date(startDate.getTime() + sessionLength * 60 * 60 * 1000);
      setEndDate(newEnd);
    }
  }, [sessionLength, startDate]);

  const formatSessionLength = (lengthHrs: number) => {
    const hours = Math.floor(lengthHrs);
    const minutes = Math.round((lengthHrs - hours) * 60);
    return `${hours}:${minutes.toString().padStart(2, "0")}`;
  };

  const showDatePicker = (target: "start" | "end", mode: "date" | "time") => {
    setPickerTarget(target);
    setPickerMode(mode);
    setDatePickerVisible(true);
  };
  const hideDatePicker = () => setDatePickerVisible(false);

  const handleConfirm = (selectedDate: Date) => {
    if (pickerTarget === "start") {
      let newStart: Date;
      if (pickerMode === "date") {
        newStart = startDate ? mergeDateAndTime(selectedDate, startDate) : selectedDate;
      } else {
        newStart = startDate ? mergeDateAndTime(startDate, selectedDate) : selectedDate;
      }
      newStart = roundDateTo15Min(newStart);
      newStart = enforceTwoHourBuffer(newStart);
      setStartDate(newStart);
      if (sessionLength > 0) {
        setEndDate(new Date(newStart.getTime() + sessionLength * 60 * 60 * 1000));
      }
    } else {
      let newEnd: Date;
      if (pickerMode === "date") {
        newEnd = endDate ? mergeDateAndTime(selectedDate, endDate) : selectedDate;
      } else {
        newEnd = endDate ? mergeDateAndTime(endDate, selectedDate) : selectedDate;
      }
      newEnd = roundDateTo15Min(newEnd);
      setEndDate(newEnd);
      if (startDate) {
        const diffMs = newEnd.getTime() - startDate.getTime();
        setSessionLength(diffMs / (1000 * 60 * 60));
      }
    }
    hideDatePicker();
  };

  const incrementSessionLength = (hours = 0.5) => {
    setSessionLength((prev) => prev + hours);
  };

  // Format date/time for display.
  const formatDate = (date: Date | null) => {
    if (!date) return "Select Date";
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };
  const formatTime = (date: Date | null) => {
    if (!date) return "Select Time";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSubmit = async () => {
    Keyboard.dismiss();
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
      const sessionData = {
        note: helpText,
        startTime: startDate.toISOString(),
        endTime: endDate.toISOString(),
        billingDetails: {
          dynamicBasePrice,
          taxes,
          serviceFee,
          total,
        },
      };
      if (existingSession) {
        const sessionRef = doc(FIREBASE_DB, "sessions_test1", existingSession.id);
        await updateDoc(sessionRef, sessionData);
        alert("Session updated successfully!");
      } else {
        const sessionId = `${currentUser.id}_${Date.now()}`;
        const newSessionData = {
          ...sessionData,
          id: sessionId,
          senderId: currentUser.id,
          receiverId: targetUserObj.id,
          participants: [currentUser.id, targetUserObj.id],
          status: "newRequest",
          createdAt: new Date().toISOString(),
          confirmedBy: [],
        };
        await setDoc(doc(FIREBASE_DB, "sessions_test1", sessionId), newSessionData);
        alert("Session request sent successfully!");
      }
      router.back();
    } catch (error) {
      console.error("Error submitting session request:", error);
      alert("An error occurred while sending your request.");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Custom Header */}
      <RequestSessionHeader
        onBack={() => router.back()}
        photoUrl={targetUserObj.profilePhotoUrl || ""}
        firstName={targetUserObj.firstName}
      />

      {/* Main Content */}
      <View className="flex-1 p-4">
        {/* Help Options Dropdown */}
        <HelpOptionsDropdown initialValue={helpText} onChange={setHelpText} />

        {/* Starts */}
        <DateTimeRow
          label="Starts"
          dateLabel={formatDate(startDate)}
          timeLabel={formatTime(startDate)}
          onPressDate={() => showDatePicker("start", "date")}
          onPressTime={() => showDatePicker("start", "time")}
          disabled={false}
        />

        {/* Session Length */}
        <SessionLengthSelector
          sessionLength={sessionLength}
          formatSessionLength={formatSessionLength}
          incrementBy30={() => incrementSessionLength(0.5)}
          incrementBy60={() => incrementSessionLength(1)}
          onReset={() => setSessionLength(0)}
        />

        {/* Conditionally render Ends only if startDate is set and sessionLength > 0 */}
        {startDate && sessionLength > 0 && (
          <DateTimeRow
            label="Ends"
            dateLabel={formatDate(endDate)}
            timeLabel={formatTime(endDate)}
            onPressDate={() => {}}
            onPressTime={() => {}}
            disabled={true}
          />
        )}

        {/* Billing Info */}
        <BillingCard
          basePrice={dynamicBasePrice}
          taxes={taxes}
          serviceFee={serviceFee}
          total={total}
        />

        {/* Submit Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-blue-600 rounded-lg p-4 items-center"
        >
          <Text className="text-white text-base font-bold">
            {existingSession ? "Update Session" : "Send Request"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* DateTimePickerModal */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={pickerMode}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minuteInterval={15}
        minimumDate={
          pickerTarget === "start"
            ? startDate && startDate.toDateString() !== new Date().toDateString()
              ? new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 0, 0, 0)
              : new Date(Date.now() + 2 * 60 * 60 * 1000)
            : startDate || new Date()
        }
      />
    </SafeAreaView>
  );
};

export default RequestSession;