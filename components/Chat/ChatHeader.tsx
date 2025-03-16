// src/components/Chat/ChatHeader.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import { Session } from '@/types/Sessions';
import { User } from '@/types/User';
import { subscribeToSession } from '@/services/firebase/sessionService';
import { setActiveProfile } from '@/redux/activeProfileSlice';
import { formatDate, formatTimeRange } from '@/scripts/datetimeHelpers';
import { confirmSessionBookingThunk, updateSessionStatus } from '@/redux/sessionSlice';
import { LinearGradient } from 'expo-linear-gradient';

interface ChatHeaderProps {
  session: Session;
  user: User;
  isExpanded: boolean;
  toggleExpanded: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  session,
  user,
  isExpanded,
  toggleExpanded,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const [currentSession, setCurrentSession] = useState<Session>(session);

  useEffect(() => {
    const unsubscribe = subscribeToSession(session.id, (updatedSession) => {
      setCurrentSession(updatedSession);
      console.log('Live session update:', updatedSession);
    });
    return () => unsubscribe();
  }, [session.id]);

  // Basic status checks
  const isConfirmed = currentSession.status === 'confirmed';
  const isUserConfirmed = !!currentUser && currentSession.confirmedBy?.includes(currentUser.id);

  const formattedDate = formatDate(currentSession.startTime || '');
  const formattedTimeRange = formatTimeRange(
    currentSession.startTime || '',
    currentSession.endTime || ''
  );

  // If expanded => show location; else => show combined date/time
  let subTitle = '';
  if (isExpanded) {
    // If current user is PSW & user has no address => "Current Address"
    subTitle =
      currentUser?.isPsw && !user.address
        ? 'Current Address'
        : user.address || 'No Address';
  } else {
    // e.g. "Wed, 30 Oct • 10:00 AM - 11:00 AM"
    subTitle = `${formattedDate} • ${formattedTimeRange}`;
  }

  // Session actions
  const handleBookSession = async () => {
    if (!currentUser) return;
    try {
      await dispatch(confirmSessionBookingThunk({
        sessionId: currentSession.id,
        currentUserId: currentUser.id,
        existingConfirmedBy: currentSession.confirmedBy,
      }));
    } catch (error) {
      console.error('Error booking session:', error);
    }
  };

  const handleCancelSession = async () => {
    try {
      if (currentSession.status === 'pending') {
        await dispatch(updateSessionStatus({
          sessionId: currentSession.id,
          newStatus: 'declined',
        }));
      } else if (currentSession.status === 'confirmed') {
        await dispatch(updateSessionStatus({
          sessionId: currentSession.id,
          newStatus: 'cancelled',
        }));
      }
      router.back();
    } catch (error) {
      console.error('Error cancelling session:', error);
    }
  };

  const handleNavigateToRequestSession = () => {
    dispatch(setActiveProfile(user));
    router.push({
      pathname: '/request-sessions',
      params: {
        otherUserId: user.id,
        sessionObj: JSON.stringify(currentSession),
      },
    });
  };

  const handleNavigateToUserProfile = () => {
    dispatch(setActiveProfile(user));
    router.push('/other-user-profile');
  };

  // Determine if Book button is disabled
  const isDisabled = !isConfirmed && isUserConfirmed;
  const bookText = isConfirmed ? 'Change' : isUserConfirmed ? 'Waiting...' : 'Book';
  console.log('iConfirm:', isConfirmed, 'isUserConfirm:', isUserConfirmed, 'isDisabled: ', isDisabled, 'bookText:', bookText);

  // Extract total cost if present
  const totalCost = currentSession.billingDetails?.total ?? 0;
  const costLabel = `${totalCost.toFixed(2)}`;
  const startDate = session.startTime ? new Date(session.startTime) : null;
  const endDate = session.endTime ? new Date(session.endTime) : null;
  const isNextDay = startDate && endDate ? endDate.getDate() !== startDate.getDate() : false;

  return (
    <>
      <LinearGradient
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        colors={isConfirmed?["#008DF4", "#5CBAFF"]:["#ffffff", "#ffffff"]}
        className="py-2"
      >
      {/* Top row */}
      <View className="flex-row items-center px-4 py-3">
        {/* Back arrow */}
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="chevron-back" size={24} color={isConfirmed ? '#fff' : '#000'} />
        </TouchableOpacity>

        {/* Photo */}
        <Image
          source={{ uri: user.profilePhotoUrl || 'https://via.placeholder.com/50' }}
          className="w-14 h-14 rounded-full mr-3"
        />

        {/* Name + subTitle */}
        <TouchableOpacity onPress={toggleExpanded} className="flex-1">
          <Text className={`font-semibold text-lg ${isConfirmed ? 'text-white' : 'text-black'}`}>
            {user.firstName} {user.lastName}
          </Text>
          <Text className={`text-xs mt-0.5 ${isConfirmed ? 'text-white' : 'text-gray-500'}`}>{subTitle}</Text>
        </TouchableOpacity>

        {/* Info circle only if expanded */}
        {isExpanded && (
          <TouchableOpacity onPress={() => { /* do nothing for now */ }}>
            <Ionicons name="information-circle-outline" size={27} color={isConfirmed ? '#fff' : '#000'} onPress={handleNavigateToUserProfile} />
          </TouchableOpacity>
        )}
      </View>

      {/* If expanded => session detail panel */}
      {isExpanded && (
        <View className="px-4 pb-4">
          {/* Note */}
          <Text className={`text-base mb-2 ${isConfirmed ? 'text-white' : 'text-gray-500'}`}>
            {currentSession.note || 'No additional details provided.'}
          </Text>

          {/* Date/Time row => center horizontally, bigger icons */}
        <View
          className={`flex-row items-center justify-center rounded-lg py-2 mb-4 ${isConfirmed? "border" : ""}`}
          style={{ borderColor: "#ffffff", width: "100%", backgroundColor: isConfirmed? "transparent" : "#f0f0f0" }}
        >
          <View className="flex-1 flex-row items-center justify-center py-3">
            <Ionicons name="calendar" size={18} color={isConfirmed ? '#fff' : '#000'} />
            <Text className={`text-sm ml-2 ${isConfirmed ? 'text-white' : 'text-black'}`}>{formattedDate}</Text>
            <Text className="text-xs text-green-400 ml-2">{`${isNextDay? '+1':""}`}</Text>
          </View>
          <View style={{ width: 1, height: 28}} className='bg-gray-300'/>
          <View className="flex-1 flex-row items-center justify-center">
            <Ionicons name="time" size={18} color={isConfirmed ? '#fff' : '#000'} />
            <Text className={`text-sm ml-2 ${isConfirmed ? 'text-white' : 'text-black'}`}>{formattedTimeRange}</Text>
          </View>
        </View>

          {/* Row #1: Book & Cancel side by side then change */}
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              onPress={isConfirmed? handleNavigateToRequestSession : handleBookSession}
              disabled={isDisabled}
              activeOpacity={0.8}
              className={`px-6 py-3 rounded-lg`}
              style={{ width: "48%", backgroundColor: isConfirmed? '#fff' : isDisabled? '#d1d5db'  : '#008DF4' }}
            >
              <Text className={`text-sm text-center ${isConfirmed ? 'text-black' : 'text-white'}`}>
                {bookText}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleCancelSession}
              activeOpacity={0.8}
              className="bg-black px-6 py-3 rounded-lg"
              style={{ width: "48%" }}
            >
              <Text className="text-white text-sm text-center">Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Status & Total Cost Row */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center">
              <Text className={`text-xs ${isConfirmed ? 'text-white' : 'text-black'}`}>{isConfirmed ? "Appointment Confirmed" : "Awaiting confirmation"}</Text>
              <Ionicons 
              name={isConfirmed? 'checkmark-circle' : "alert-circle"} 
              size={18} 
              color={isConfirmed ? '#fff' : '#9ca3af'} 
              style={{ marginLeft: 4 }} />
            </View>
            <Text className={`text-xs ${isConfirmed ? 'text-white' : 'text-black'}`}>
              Total: <Text className="font-medium">${costLabel}</Text>
            </Text>
          </View>
        
          {/* Request Date/Time Change Button */}
          {isConfirmed ? <></> : (<TouchableOpacity
            onPress={handleNavigateToRequestSession}
            activeOpacity={0.8}
            className={`border px-5 py-2 items-center rounded-lg ${isConfirmed? "border-white" : "border-black"}`}
          >
            <Text className={`text-sm ${isConfirmed ? 'text-white' : 'text-black'}`}>Request Date/Time Change</Text>
          </TouchableOpacity>)}
        </View>
      )}
      </LinearGradient>
    </>
  );
};

export default ChatHeader;