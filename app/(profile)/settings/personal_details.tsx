import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput, Image } from 'react-native';
import { DatePickerField } from '@/shared/components';
import { RegionValidatedAddressInput } from '@/shared/components';
import { Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { router } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserFields } from '@/redux/userSlice';
import { AuthApi } from '@/features/auth/api/authApi';
import { RootState } from '@/redux/store';
import { setUserDoc } from '@/services/firebase/firestore';

const PersonalDetailsScreen = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.userData);
  const [firstName, setFirstName] = useState(userData?.firstName || '');
  const [lastName, setLastName] = useState(userData?.lastName || '');
  const [phone, setPhone] = useState(userData?.phone || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [address, setAddress] = useState(userData?.address?.fullAddress || '');
  const [dob, setDob] = useState(userData?.dob || '');
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [gender, setGender] = useState(userData?.gender || '');
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const allFilled = firstName && lastName && phone && email && address && dob && gender;

  const handleContinue = async () => {
    if (!allFilled) return;
    // Merge new values with existing userData to avoid losing any fields
    const criticalInfoData = {
      ...userData,
      firstName,
      lastName,
      dob,
      address: {
        ...userData?.address,
        fullAddress: address,
        street: userData?.address?.street ?? '',
        city: userData?.address?.city ?? '',
        province: userData?.address?.province ?? '',
        country: userData?.address?.country ?? '',
        postalCode: userData?.address?.postalCode ?? '',
      },
      phone,
      email,
      gender,
    };
    try {
      if (userData?.id) {
        await AuthApi.addCriticalInfo(userData.id, criticalInfoData);
        dispatch(updateUserFields(criticalInfoData));
        router.back();
      } else {
        alert('User ID not found.');
      }
    } catch (err: any) {
      alert('Failed to update profile: ' + err.message);
    }
  };
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F8FA', paddingTop: 32 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 60}
      >
        <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 17 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ padding: 8, marginRight: 8 }}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ flex: 1, textAlign: 'center', fontWeight: 'bold', fontSize: 18 }} numberOfLines={2} ellipsizeMode="tail">
            Personal Details
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} style={{ flex: 1, borderWidth: 1, borderColor: '#BFBFC3', borderRadius: 6, padding: 12, backgroundColor: '#fff' }} />
          <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} style={{ flex: 1, borderWidth: 1, borderColor: '#BFBFC3', borderRadius: 6, padding: 12, backgroundColor: '#fff' }} />
        </View>
        {/* Address Verification */}
        <View style={{ marginBottom: 12 }}>
          <RegionValidatedAddressInput
            placeholder="e.g. 24 Willow Street, A1B 2C3"
            initialValue={address}
            onAddressSelected={(data) => setAddress(data.fullAddress)}
            onValidationResult={setIsAddressValid}
            otherStyles="bg-white rounded-lg border border-gray-200"
          />
        </View>
        <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={{ borderWidth: 1, borderColor: '#BFBFC3', borderRadius: 6, padding: 12, backgroundColor: '#fff', marginBottom: 12 }} />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, borderColor: '#BFBFC3', borderRadius: 6, padding: 12, backgroundColor: '#fff', marginBottom: 12 }} />
    {/* Removed country, province, city fields. Address is now handled by RegionValidatedAddressInput. */}
              {/* Date of Birth */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#18181B', marginBottom: 8 }}>Date of Birth <Ionicons name="information-circle-outline" size={16} color="#303031" /></Text>
                <DatePickerField
                  title=""
                  value={dob}
                  onDateChange={setDob}
                  otherStyles="bg-white border border-gray-200 rounded-lg"
                />
              </View>
              {/* Gender Dropdown */}
              <View style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: '#18181B', marginBottom: 8 }}>Gender <Ionicons name="information-circle-outline" size={16} color="#303031" /></Text>
                <TouchableOpacity
                  style={{ borderWidth: 1, borderColor: '#BFBFC3', borderRadius: 6, padding: 12, backgroundColor: '#fff', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}
                  onPress={() => setShowGenderDropdown((prev: boolean) => !prev)}
                >
                  <Text style={{ fontSize: 16, color: gender ? '#18181B' : '#BFBFC3' }}>{gender || 'Select Gender'}</Text>
                  <Ionicons name={showGenderDropdown ? 'chevron-up' : 'chevron-down'} size={20} color="#BFBFC3" />
                </TouchableOpacity>
                {showGenderDropdown && (
                  <View style={{ borderWidth: 1, borderColor: '#BFBFC3', borderRadius: 6, backgroundColor: '#fff', marginTop: 2 }}>
                    {['Male', 'Female', 'Other'].map((option) => (
                      <TouchableOpacity key={option} onPress={() => { setGender(option); setShowGenderDropdown(false); }} style={{ padding: 12 }}>
                        <Text style={{ fontSize: 16, color: '#18181B' }}>{option}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
        
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, paddingHorizontal: 2 }}>
          <Ionicons name="information-circle-outline" size={20} color="#BFBFC3" style={{ marginRight: 8, marginTop: 2 }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 13, color: '#303031', lineHeight: 18 }}>
              We’ll use this to personalize matches and support. This info is confidential and only shared with your consent. By continuing, you agree to our
              <Text style={{ color: '#007AFF' }} onPress={() => Linking.openURL('https://your-privacy-policy-url.com')}> Privacy Policy</Text> and
              <Text style={{ color: '#007AFF' }} onPress={() => Linking.openURL('https://your-terms-url.com')}> Terms of Use</Text>.
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={{ backgroundColor: allFilled ? '#18181B' : '#BFBFC3', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 24 }}
          disabled={!allFilled}
          onPress={handleContinue} // This remains unchanged
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default PersonalDetailsScreen;
