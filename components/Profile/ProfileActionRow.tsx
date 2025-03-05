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
import ProfileEditPanel from "./ProfileEditPanel";
import { User } from "@/types/User";

// Enable LayoutAnimation on Android.
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type ActionType = "wallet" | "history" | "edit" | null;

interface ProfileActionRowProps {
  user: User;
}

const ProfileActionRow: React.FC<ProfileActionRowProps> = ({ user }) => {
  const [selectedAction, setSelectedAction] = useState<ActionType>(null);

  const handlePressAction = (action: ActionType) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setSelectedAction(prev => (prev === action ? null : action));
  };

  return (
    <View>
      {/* Rest State: Show three separate buttons filling the row */}
      {!selectedAction && (
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity
            onPress={() => handlePressAction("wallet")}
            className="bg-white border border-gray-200 rounded-lg flex-1 mr-1 items-center p-3"
          >
            <Ionicons name="wallet" size={28} color="#000" />
            <Text className="text-sm mt-2">Wallet</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handlePressAction("history")}
            className="bg-white border border-gray-200 rounded-lg flex-1 items-center p-3"
          >
            <Ionicons name="time" size={28} color="#000" />
            <Text className="text-sm mt-2">History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handlePressAction("edit")}
            className="bg-white border border-gray-200 rounded-lg flex-1 ml-1 items-center p-3"
          >
            <Ionicons name="create" size={28} color="#000" />
            <Text className="text-sm mt-2">Edit Profile</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Expanded State: Show one large panel */}
      {selectedAction && (
        <View className="bg-white border border-gray-200 rounded-lg p-4 mb-2">
          <TouchableOpacity
            onPress={() => handlePressAction(null)}
            className="flex-row justify-end mb-2"
          >
            <Ionicons name="close" size={24} color="#000" />
          </TouchableOpacity>

          {selectedAction === "wallet" && <WalletPanel />}
          {selectedAction === "history" && <HistoryPanel />}
          {selectedAction === "edit" && <ProfileEditPanel user={user} />}
        </View>
      )}
    </View>
  );
};

export default ProfileActionRow;

/** Dummy Wallet Panel */
const WalletPanel: React.FC = () => {
  return (
    <View>
      <Text className="text-base font-bold mb-3">Payment Methods</Text>
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

/** Dummy History Panel */
const HistoryPanel: React.FC = () => {
  return (
    <View>
      <Text className="text-base font-bold mb-3">History</Text>
      <View className="border-b border-gray-200 py-2 flex-row justify-between items-center">
        <View>
          <Text className="text-sm font-semibold">Peter Jones</Text>
          <Text className="text-xs text-gray-500">30 Oct | 11:00</Text>
        </View>
        <Text className="text-sm font-semibold text-gray-800">$270</Text>
      </View>
      <TouchableOpacity className="mt-3 p-3 border border-gray-300 rounded-lg items-center">
        <Text className="text-sm font-semibold text-blue-600">See full history</Text>
      </TouchableOpacity>
    </View>
  );
};