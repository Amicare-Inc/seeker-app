import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { changeUserPassword } from '@/lib/auth-operations';

const PasswordScreen = () => {
  const [form, setForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleBackPress = () => {
    router.back();
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!form.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!form.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (form.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters long';
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (form.newPassword !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (form.currentPassword === form.newPassword) {
      newErrors.newPassword = 'New password must be different from current password';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Use Firebase Client SDK for secure password change with re-authentication
      await changeUserPassword(form.currentPassword, form.newPassword);
      
      Alert.alert(
        'Success',
        'Your password has been updated successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to update password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral-100">
      {/* Header */}
      <View className="flex-row items-center px-4">
        <TouchableOpacity onPress={handleBackPress} className="mr-4 absolute left-4">
          <Ionicons name="chevron-back" size={24} color="black" />
        </TouchableOpacity>
        <View className="flex-1 items-center">
          <Text className="text-xl font-medium">Change Password</Text>
        </View>
      </View>

      <ScrollView className="flex-1">
        <View className="mx-4 mt-10">
          <Text className="text-xl font-semibold">Update Password</Text>
          <Text className="text-base mt-4 text-gray-600">
            Your password must be at least 6 characters long and contain at least one digit and one letter.
          </Text>
          
          {/* Current Password */}
          <Text className="mt-6 mb-2 text-base font-semibold">Current Password</Text>
          <TextInput
            placeholder="Enter your current password"
            placeholderTextColor="#A3A3A3"
            className="bg-white p-3.5 rounded-lg text-base mb-2"
            style={{ color: 'black' }}
            secureTextEntry
            value={form.currentPassword}
            onChangeText={(text) => {
              setForm(prev => ({ ...prev, currentPassword: text }));
              if (errors.currentPassword) {
                setErrors(prev => ({ ...prev, currentPassword: '' }));
              }
            }}
          />
          {errors.currentPassword && (
            <Text className="text-red-500 text-sm mb-4">{errors.currentPassword}</Text>
          )}
          
          {/* New Password */}
          <Text className="mt-4 mb-2 text-base font-semibold">New Password</Text>
          <TextInput
            placeholder="Enter your new password"
            placeholderTextColor="#A3A3A3"
            className="bg-white p-3.5 rounded-lg text-base mb-2"
            style={{ color: 'black' }}
            secureTextEntry
            value={form.newPassword}
            onChangeText={(text) => {
              setForm(prev => ({ ...prev, newPassword: text }));
              if (errors.newPassword) {
                setErrors(prev => ({ ...prev, newPassword: '' }));
              }
            }}
          />
          {errors.newPassword && (
            <Text className="text-red-500 text-sm mb-4">{errors.newPassword}</Text>
          )}
          
          {/* Confirm Password */}
          <Text className="mt-4 mb-2 text-base font-semibold">Confirm New Password</Text>
          <TextInput
            placeholder="Confirm your new password"
            placeholderTextColor="#A3A3A3"
            className="bg-white p-3.5 rounded-lg text-base mb-2"
            style={{ color: 'black' }}
            secureTextEntry
            value={form.confirmPassword}
            onChangeText={(text) => {
              setForm(prev => ({ ...prev, confirmPassword: text }));
              if (errors.confirmPassword) {
                setErrors(prev => ({ ...prev, confirmPassword: '' }));
              }
            }}
          />
          {errors.confirmPassword && (
            <Text className="text-red-500 text-sm mb-4">{errors.confirmPassword}</Text>
          )}
          
          <TouchableOpacity
            className={`py-4 rounded-xl items-center mt-6 ${
              isLoading || !form.currentPassword || !form.newPassword || !form.confirmPassword
                ? 'bg-gray-400'
                : 'bg-brand-blue'
            }`}
            onPress={handleUpdatePassword}
            disabled={isLoading || !form.currentPassword || !form.newPassword || !form.confirmPassword}
          >
            <Text className="text-white text-xl font-medium">
              {isLoading ? 'Updating...' : 'Update Password'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PasswordScreen;