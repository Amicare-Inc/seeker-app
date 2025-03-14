// src/components/PendingSessionSlider.tsx
import React, { useState } from "react";
import { Modal, TouchableOpacity, View, Text } from "react-native";
import { EnrichedSession } from "@/types/EnrichedSession";

interface PendingSessionSliderProps {
  session: EnrichedSession;
}

const PendingSessionSlider: React.FC<PendingSessionSliderProps> = ({ session }) => {
  const [visible, setVisible] = useState(true);

  const handleAccept = () => {
    // TODO: Dispatch your accept action (update session status)
    setVisible(false);
  };

  const handleReject = () => {
    // TODO: Dispatch your reject action (update session status)
    setVisible(false);
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={() => setVisible(false)}
    >
      <View className="flex-1 justify-end">
        {/* Overlay background */}
        <TouchableOpacity
          onPress={() => setVisible(false)}
          className="absolute inset-0 bg-black opacity-30"
        />
        <View className="bg-white rounded-t-lg p-5">
          <Text className="text-base font-bold mb-2">
            Session Request: {session.note || "No details provided"}
          </Text>
          <Text className="text-sm text-gray-600 mb-4">
            {new Date(session.startTime || "").toDateString()},{" "}
            {new Date(session.startTime || "").toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}{" "}
            -{" "}
            {new Date(session.endTime || "").toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={handleAccept}
              className="flex-1 bg-blue-600 p-3 rounded-lg mx-1 items-center"
            >
              <Text className="text-white font-bold">Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleReject}
              className="flex-1 bg-gray-300 p-3 rounded-lg mx-1 items-center"
            >
              <Text className="text-black font-bold">Reject</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PendingSessionSlider;