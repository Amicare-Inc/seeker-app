import React, { useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, KeyboardAvoidingView, Platform, TouchableOpacity, TextInput, Image } from 'react-native';
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
  const [country, setCountry] = useState(userData?.address?.country || '');
  const [province, setProvince] = useState(userData?.address?.province || '');
  const [city, setCity] = useState(userData?.address?.city || '');
  const [address, setAddress] = useState(userData?.address?.fullAddress || '');
  const [dob, setDob] = useState(userData?.dob || '');
  const [gender, setGender] = useState(userData?.gender || '');
  const allFilled = firstName && lastName && phone && email && country && province && city && address && dob && gender;

  const handleContinue = async () => {
    if (!allFilled) return;
    const criticalInfoData = {
      isPsw: userData?.isPsw || false,
      firstName,
      lastName,
      dob,
      address: {
        fullAddress: address,
        street: userData?.address?.street || '',
        city,
        province,
        country,
        postalCode: userData?.address?.postalCode || '',
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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 60}
      >
        <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '500' }}>
            <Text style={{ backgroundColor: '#FFF500', paddingHorizontal: 4, borderRadius: 4 }}>Personal</Text> Details
          </Text>
        </View>
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: '#E9E9EA', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#BFBFC3' }}>Add Photo</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <TextInput placeholder="First Name" value={firstName} onChangeText={setFirstName} style={{ flex: 1, borderWidth: 1, borderColor: '#BFBFC3', borderRadius: 6, padding: 12, backgroundColor: '#fff' }} />
          <TextInput placeholder="Last Name" value={lastName} onChangeText={setLastName} style={{ flex: 1, borderWidth: 1, borderColor: '#BFBFC3', borderRadius: 6, padding: 12, backgroundColor: '#fff' }} />
        </View>
  <TextInput placeholder="Phone" value={phone} onChangeText={setPhone} style={{ borderWidth: 1, borderColor: '#BFBFC3', borderRadius: 6, padding: 12, backgroundColor: '#fff', marginBottom: 12 }} />
  <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, borderColor: '#BFBFC3', borderRadius: 6, padding: 12, backgroundColor: '#fff', marginBottom: 12 }} />
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <TextInput placeholder="Country" value={country} onChangeText={setCountry} style={{ flex: 1, borderWidth: 1, borderColor: '#BFBFC3', borderRadius: 6, padding: 12, backgroundColor: '#fff' }} />
          <TextInput placeholder="Province / State" value={province} onChangeText={setProvince} style={{ flex: 1, borderWidth: 1, borderColor: '#BFBFC3', borderRadius: 6, padding: 12, backgroundColor: '#fff' }} />
        </View>
  <TextInput placeholder="City / Town" value={city} onChangeText={setCity} style={{ borderWidth: 1, borderColor: '#BFBFC3', borderRadius: 6, padding: 12, backgroundColor: '#fff', marginBottom: 12 }} />
  <TextInput placeholder="Address" value={address} onChangeText={setAddress} style={{ borderWidth: 1, borderColor: '#BFBFC3', borderRadius: 6, padding: 12, backgroundColor: '#fff', marginBottom: 12 }} />
  <TextInput placeholder="Date of birth DD.MM.YYYY" value={dob} onChangeText={setDob} style={{ borderWidth: 1, borderColor: '#BFBFC3', borderRadius: 6, padding: 12, backgroundColor: '#fff', marginBottom: 12 }} />
        <TextInput
          placeholder="Gender: Male / Female / X"
          value={gender}
          onChangeText={setGender}
          style={{ borderWidth: 1, borderColor: '#BFBFC3', borderRadius: 6, padding: 12, backgroundColor: '#fff', marginBottom: 24 }}
        />
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
          <Ionicons name="information-circle-outline" size={20} color="#BFBFC3" style={{ marginRight: 8, marginTop: 2 }} />
          <Text style={{ fontSize: 13, color: '#303031' }}>
            We’ll use this to <Text style={{ backgroundColor: '#FFF500' }}>personal</Text>ize matches and support. This info is confidential and only shared with your consent. By continuing, you agree to our{' '}
            <Text style={{ color: '#007AFF' }} onPress={() => Linking.openURL('https://your-privacy-policy-url.com')}>Privacy Policy</Text> and{' '}
            <Text style={{ color: '#007AFF' }} onPress={() => Linking.openURL('https://your-terms-url.com')}>Terms of Use</Text>.
          </Text>
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
