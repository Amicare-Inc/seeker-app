import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { deleteUserAccount } from '@/lib/auth-operations';

const DeleteAccountScreen = () => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleBackPress = () => {
    router.back();
  };

  const handleDeleteAccount = async () => {
    if (!password.trim()) {
      setError('Password is required to delete your account');
      return;
    }

    // Show final confirmation
    Alert.alert(
      'Delete Account',
      'Are you absolutely sure you want to delete your account? This action cannot be undone and will permanently remove all your data.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setIsLoading(true);
            try {
              // Use Firebase Client SDK for secure account deletion with re-authentication
              await deleteUserAccount(password);
              
              Alert.alert(
                'Account Deleted',
                'Your account has been permanently deleted.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Navigate to sign-in screen
                      router.dismissAll();
                      router.replace('/');
                    },
                  },
                ]
              );
            } catch (error: any) {
              setError(error.message || 'Failed to delete account');
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="flex-row items-center px-4">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Delete Account</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="mx-4 mt-10">
          <Text className="text-xl font-semibold text-red-600">Permanently Delete Account</Text>
          
          <View className="bg-red-50 border border-red-200 rounded-lg p-4 mt-6">
            <Text className="text-red-800 font-semibold mb-2">⚠️ Warning</Text>
            <Text className="text-red-700 text-sm">
              This action cannot be undone. Deleting your account will permanently remove:
            </Text>
            <Text className="text-red-700 text-sm mt-2">
              • Your profile and personal information{'\n'}
              • All your session history{'\n'}
              • Your payment information{'\n'}
              • All app data associated with your account
            </Text>
          </View>
          
          <Text className="text-base mt-6 mb-2 font-semibold">
            Enter your password to confirm account deletion:
          </Text>
          
          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#A3A3A3"
            className="bg-white p-3.5 rounded-lg text-base mb-2"
            style={{ color: 'black' }}
            secureTextEntry
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            editable={!isLoading}
          />
          
          {error ? (
            <Text className="text-red-500 text-sm mb-4">{error}</Text>
          ) : null}
          
          <TouchableOpacity
            className={`py-4 rounded-xl items-center mt-6 ${
              isLoading || !password.trim() ? 'bg-gray-400' : 'bg-red-600'
            }`}
            onPress={handleDeleteAccount}
            disabled={isLoading || !password.trim()}
          >
            <Text className="text-white text-xl font-medium">
              {isLoading ? 'Deleting Account...' : 'Delete My Account'}
            </Text>
          </TouchableOpacity>
          
          <Text className="text-gray-500 text-sm text-center mt-4">
            Need help? Contact our support team before deleting your account.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DeleteAccountScreen;
