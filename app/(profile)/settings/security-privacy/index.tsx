import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const SecurityPrivaryScreen = () => {
  const [isFaceIDModalVisible, setFaceIDModalVisible] = useState(false);
  const [isAccountDeletionModalVisible, setAccountDeletionModalVisible] = useState(false);

  const handleBackPress = () => {
    router.back();
  };

  const handleFaceIDPress = () => {
    setFaceIDModalVisible(true);
  };

  const handleAccountDeletionPress = () => {
    setAccountDeletionModalVisible(true);
  };

  const closeFaceIDModal = () => {
    setFaceIDModalVisible(false);
  };

  const closeAccountDeletionModal = () => {
    setAccountDeletionModalVisible(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="flex-row items-center px-4">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Security & Privacy</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="bg-white rounded-lg mx-4 mt-6">
          <SettingsListItem
            label="Password"
            description="Change your password"
            onPress={() => router.push('/(profile)/settings/security-privacy/password')}
          />
          <SettingsListItem
            label="Face ID"
            description="Require Face ID for login, transactions and after 5 minutes of inactivity"
            onPress={handleFaceIDPress} // Show Face ID modal
          />
          <SettingsListItem
            label="Recovery Phone"
            description="Add a backup phone number to access your account"
            onPress={() => router.push('/(profile)/settings/security-privacy/recovery-phone')}
          />
        </View>
        <View className="bg-white rounded-lg mx-4 mt-8">
          <SettingsListItem
            label="Biometric Data"
            description="Allow Amicare to store and use your selfie and ID for automated verification"
            onPress={() => console.log('Biometric Data pressed')}
          />
          <SettingsListItem
            label="Privacy Policy"
            description="Learn how we protect and use your personal information"
            onPress={() => console.log('Privacy Policy pressed')}
          />
        </View>
        <View className="bg-white rounded-lg mx-4 mt-8">
          <SettingsListItem
            label="Account Deletion"
            description="Temporarily deactivate or permanently delete your account"
            onPress={handleAccountDeletionPress} // Show Account Deletion modal
          />
        </View>
      </ScrollView>

      {/* Face ID Modal */}
      <Modal
        transparent={true}
        visible={isFaceIDModalVisible}
        animationType="fade"
        onRequestClose={closeFaceIDModal} // Close modal when back button is pressed on Android
      >
        <TouchableWithoutFeedback onPress={closeFaceIDModal}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black background with 50% opacity
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-xl p-6 items-center mx-4">
                {/* Removed FaceIdIcon */}
                <Text className="text-xl font-semibold mt-6">Face ID</Text>
                <Text className="text-center text-base text-grey-58 mb-6 font-medium">
                  Would you like to enable Face ID? It’s a quicker and more secure alternative to
                  entering your password.
                </Text>
                <View className="flex-row gap-5 w-full">
                  <TouchableOpacity
                    onPress={closeFaceIDModal}
                    className="bg-brand-blue rounded-xl w-[47%] flex items-center justify-center p-2"
                  >
                    <Text className="text-base text-white font-medium">Enable</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={closeFaceIDModal}
                    className="bg-black w-[47%] rounded-xl flex items-center justify-center"
                  >
                    <Text className="text-base text-white font-medium">No, thanks</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Account Deletion Modal */}
      <Modal
        transparent={true}
        visible={isAccountDeletionModalVisible}
        animationType="fade"
        onRequestClose={closeAccountDeletionModal} // Close modal when back button is pressed on Android
      >
        <TouchableWithoutFeedback onPress={closeAccountDeletionModal}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)', // Black background with 50% opacity
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <TouchableWithoutFeedback>
              <View className="bg-white rounded-xl p-6 items-center mx-4">
                <Text className="text-xl font-semibold mt-2 mb-4">Verify your Identity</Text>
                <Text className="text-center text-base text-grey-58 mb-6 font-medium">
                  For security reasons, you will be prompted to sign in and verify your identity in order to request account deletion.
                </Text>
                <View className="flex-row gap-5 w-full">
                  {/* Enable Button */}
                  <TouchableOpacity
                    onPress={() => {
                      closeAccountDeletionModal(); // Close the modal
                      router.push('/(profile)/settings/security-privacy/verify/contact'); // Navigate to the verification screen
                    }}
                    className="bg-brand-blue w-[47%] h-10 rounded-xl flex items-center justify-center"
                  >
                    <Text className="text-base text-white font-medium">Confirm</Text>
                  </TouchableOpacity>
                  {/* Close Button */}
                  <TouchableOpacity
                    onPress={closeAccountDeletionModal} // Only close the modal
                    className="bg-black w-[47%] h-10 rounded-xl flex items-center justify-center"
                  >
                    <Text className="text-base text-white font-medium">Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </SafeAreaView>
  );
};

interface SettingsListItemProps {
  label: string;
  description?: string; // Optional description prop
  onPress: () => void;
}

const SettingsListItem: React.FC<SettingsListItemProps> = ({ label, description, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} className="flex-row items-start p-4 gap-3">
      <View className="flex-1">
        <Text className="text-base text-grey-80 font-semibold w-2/3">{label}</Text>
        {description && (
          <Text className="text-base text-grey-49 mt-1 w-[90%]">{description}</Text>
        )}
      </View>
      <View className="absolute justify-center items-center right-4 top-1/2">
        <Ionicons name="chevron-forward" size={20} color="#bfbfc3" />
      </View>
    </TouchableOpacity>
  );
};

export default SecurityPrivaryScreen;