import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  visible: boolean;
  onClose: () => void;
}

const VerificationModal: React.FC<Props> = ({ visible, onClose }) => (
  <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
    <View className="flex-1 justify-center items-center bg-black/40 px-6">
      <View className="bg-white rounded-xl p-6 w-full max-w-sm">
        <View className="items-center mb-4">
          <Ionicons name="shield-checkmark" size={40} color="#F97316" />
          <Text className="text-lg font-bold mt-3 text-center text-gray-800">Profile Verification Required</Text>
        </View>
        <Text className="text-gray-600 text-center mb-6">
          Your profile is currently under review. Please wait for verification to complete before accessing user details or requesting sessions.
        </Text>
        <TouchableOpacity onPress={onClose} className="bg-blue-500 rounded-lg py-3">
          <Text className="text-white text-center font-semibold">Got it</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default VerificationModal; 