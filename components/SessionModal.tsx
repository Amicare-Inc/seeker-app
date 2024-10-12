import React from 'react';
import { Modal, TouchableOpacity, View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import UserCardExpanded from './UserCardExpanded';
import { User } from "@/types/User";

interface SessionModalProps {
  isVisible: boolean;
  onClose: () => void; // Use onClose for closing the modal
  onAction: (action: 'accept' | 'reject' | 'book' | 'reject_book' | 'cancelled') => void; // Only for actions
  user: User | null;
  isConfirmed?: boolean;
  isPending?: boolean;
  isBooked?: boolean;
}

const SessionModal: React.FC<SessionModalProps> = ({ isVisible, onClose, onAction, user, isConfirmed, isPending, isBooked }) => {
  if (!user) return null;

  return (
    <Modal
      transparent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose} // Use onClose directly here
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

          {/* Conditional Buttons for Not Confirmed (Pending) Section */}
          {isPending && (
            <View className="mt-4 w-full px-6">
              <TouchableOpacity onPress={() => onAction('accept')} className="bg-blue-500 py-3 rounded-lg">
                <Text className="text-white text-center text-lg">Accept</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onAction('reject')} className="bg-red-500 py-3 rounded-lg mt-2">
                <Text className="text-white text-center text-lg">Reject</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Conditional Buttons for Confirmed Section */}
          {isConfirmed && (
            <View className="mt-4 w-full px-6">
              <TouchableOpacity onPress={() => onAction('book')} className="bg-blue-500 py-3 rounded-lg">
                <Text className="text-white text-center text-lg">Book</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => onAction('reject_book')} className="bg-red-500 py-3 rounded-lg mt-2">
                <Text className="text-white text-center text-lg">Reject</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Conditional Buttons for Confirmed Section */}
          {isBooked && (
            <View className="mt-4 w-full px-6">
              <TouchableOpacity onPress={() => onAction('cancelled')} className="bg-red-500 py-3 rounded-lg mt-2">
                <Text className="text-white text-center text-lg">Reject</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </BlurView>
    </Modal>
  );
};

export default SessionModal;