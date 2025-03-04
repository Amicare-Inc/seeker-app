// @/components/Profile/ProfileActionRow.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

/**
 * If on Android, we need to enable LayoutAnimation.
 */
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/** 
 * Three possible actions the user can select: 'wallet', 'history', or 'edit'.
 */
type ActionType = "wallet" | "history" | "edit" | null;

const ProfileActionRow: React.FC = () => {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);

  /**
   * Toggles the selected action. If the user presses the same button again,
   * we collapse it by setting to null. Otherwise we expand the new panel.
   * We call LayoutAnimation to get a smooth expand/collapse effect.
   */
  const handlePressAction = (action: ActionType) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedAction((prev) => (prev === action ? null : action));
  };

  return (
    <View>
      {/* The row of big buttons */}
      <View className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
        <View className="flex-row justify-around">
          <TouchableOpacity
            onPress={() => handlePressAction("wallet")}
            className="items-center"
          >
            <Ionicons
              name="wallet"
              size={28}
              color={selectedAction === "wallet" ? "#007AFF" : "#000"}
            />
            <Text
              className={`text-sm font-semibold mt-2 ${
                selectedAction === "wallet" ? "text-blue-600" : ""
              }`}
            >
              Wallet
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handlePressAction("history")}
            className="items-center"
          >
            <Ionicons
              name="time"
              size={28}
              color={selectedAction === "history" ? "#007AFF" : "#000"}
            />
            <Text
              className={`text-sm font-semibold mt-2 ${
                selectedAction === "history" ? "text-blue-600" : ""
              }`}
            >
              History
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handlePressAction("edit")}
            className="items-center"
          >
            <Ionicons
              name="create"
              size={28}
              color={selectedAction === "edit" ? "#007AFF" : "#000"}
            />
            <Text
              className={`text-sm font-semibold mt-2 ${
                selectedAction === "edit" ? "text-blue-600" : ""
              }`}
            >
              Edit Profile
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Conditionally render the expanded panel below, if any action is selected */}
      {selectedAction && (
        <View className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          {selectedAction === "wallet" && <WalletPanel />}
          {selectedAction === "history" && <HistoryPanel />}
          {selectedAction === "edit" && <EditProfilePanel />}
        </View>
      )}
    </View>
  );
};

/** Panel #1: Wallet (dummy) */
const WalletPanel: React.FC = () => {
  return (
    <View>
      <Text className="text-base font-bold mb-3">Payment methods</Text>
      <View className="border-b border-gray-200 py-2 flex-row justify-between items-center">
        <Text className="text-sm text-gray-700">Visa ***4360</Text>
        <Ionicons name="chevron-forward" size={18} color="#000" />
      </View>
      <View className="border-b border-gray-200 py-2 flex-row justify-between items-center">
        <Text className="text-sm text-gray-700">Mastercard ***4360</Text>
        <Ionicons name="chevron-forward" size={18} color="#000" />
      </View>
      <View className="border-b border-gray-200 py-2 flex-row justify-between items-center">
        <Text className="text-sm text-gray-700">Apple Pay</Text>
        <Ionicons name="chevron-forward" size={18} color="#000" />
      </View>
      <TouchableOpacity className="mt-3 p-3 border border-gray-300 rounded-lg items-center">
        <Text className="text-sm font-semibold text-blue-600">+ Add Payment Method</Text>
      </TouchableOpacity>
    </View>
  );
};

/** Panel #2: History (dummy) */
const HistoryPanel: React.FC = () => {
  return (
    <View>
      <Text className="text-base font-bold mb-3">History</Text>
      {/* A single dummy item */}
      <View className="border-b border-gray-200 py-2 flex-row justify-between items-center">
        <View>
          <Text className="text-sm font-semibold">Peter Jones</Text>
          <Text className="text-xs text-gray-500">30 Oct | 11:00</Text>
        </View>
        <Text className="text-sm font-semibold text-gray-800">$270</Text>
      </View>
      {/* A "See full history" button */}
      <TouchableOpacity className="mt-3 p-3 border border-gray-300 rounded-lg items-center">
        <Text className="text-sm font-semibold text-blue-600">See full history</Text>
      </TouchableOpacity>
    </View>
  );
};

/** Panel #3: Edit Profile (dummy) */
const EditProfilePanel: React.FC = () => {
  return (
    <View>
      <Text className="text-base font-bold mb-3">Edit Profile</Text>
      {/* Dummy fields */}
      <View className="mb-3">
        <Text className="text-sm font-semibold mb-1">Bio</Text>
        <View className="border border-gray-300 rounded-lg p-2">
          <Text className="text-sm text-gray-700">
            Hello, my name is Jane. I am a 60 year old cancer patient seeking support...
          </Text>
        </View>
      </View>

      <View className="mb-3">
        <Text className="text-sm font-semibold mb-1">Diagnoses</Text>
        <View className="flex-row flex-wrap">
          <TouchableOpacity className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2">
            <Text className="text-sm text-gray-700">Cancer</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2">
            <Text className="text-sm text-gray-700">Dementia</Text>
          </TouchableOpacity>
          <TouchableOpacity className="border border-gray-300 rounded-full px-3 py-1 mr-2 mb-2">
            <Text className="text-sm text-blue-600">+ Add diagnosis</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View>
        <Text className="text-sm font-semibold mb-1">Seeking support with</Text>
        <View className="flex-row flex-wrap">
          <TouchableOpacity className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2">
            <Text className="text-sm text-gray-700">Housekeeping</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2">
            <Text className="text-sm text-gray-700">Mobility</Text>
          </TouchableOpacity>
          <TouchableOpacity className="border border-gray-300 rounded-full px-3 py-1 mr-2 mb-2">
            <Text className="text-sm text-blue-600">+ Add item</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default ProfileActionRow;