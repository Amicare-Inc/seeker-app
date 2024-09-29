import React from 'react';
import { Modal, TouchableOpacity, View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import UserCardExpanded from './UserCardExpanded';
import { User } from "@/types/User";

interface SessionModalProps {
  isVisible: boolean;
  onClose: () => void;
  user: User | null;
  actions: { label: string; onPress: () => void; style: string }[]; 
}

const SessionModal: React.FC<SessionModalProps> = ({ isVisible, onClose, user, actions }) => {
  if (!user) return null;

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <BlurView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        tint="light"
        intensity={50}
      >
        <View className="w-full h-full justify-center items-center">
          <TouchableOpacity onPress={onClose} className="bg-transparent w-11/12 rounded-lg p-0">
            <UserCardExpanded user={user} onPress={onClose} />
          </TouchableOpacity>
          <View className="mt-4 w-full px-6">
          {actions.map(action => (
            <TouchableOpacity
            key={action.label}
            onPress={action.onPress}
            className={`${action.style} py-3 rounded-lg mb-2`}
            >
            <Text className="text-white text-center text-lg">{action.label}</Text>
            </TouchableOpacity>
          ))}
          </View>
        </View>
      </BlurView>
    </Modal>
  );
};

export default SessionModal;