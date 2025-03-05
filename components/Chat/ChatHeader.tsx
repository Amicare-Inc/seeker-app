// src/components/Chat/ChatHeader.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { Session } from '@/types/Sessions';
import { User } from '@/types/User';
import { subscribeToSession, confirmSessionBooking, cancelSession } from '@/services/firebase/sessionService';
import { setActiveProfile } from '@/redux/activeProfileSlice';

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
  const dispatch = useDispatch();
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
  const isUserConfirmed =
    !!currentUser && currentSession.confirmedBy?.includes(currentUser.id);

  // Format date/time
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? 'Invalid Date'
      : date.toLocaleDateString('en-US', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
        });
  };

  const formatTimeRange = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime())) return 'Invalid Time';
    const startStr = s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endStr = e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${startStr} - ${endStr}`;
  };

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
      await confirmSessionBooking(currentSession.id, currentUser.id, currentSession.confirmedBy);
    } catch (error) {
      console.error('Error booking session:', error);
    }
  };

  const handleCancelSession = async () => {
    try {
      await cancelSession(currentSession.id, currentSession.status);
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

  // Determine if Book button is disabled
  const isDisabled = isConfirmed || isUserConfirmed;
  const bookText = isConfirmed ? 'Confirmed' : isUserConfirmed ? 'Waiting...' : 'Book';

  // Extract total cost if present
  const totalCost = currentSession.billingDetails?.total ?? 0;
  const costLabel = `Total: $${totalCost.toFixed(2)}`;

  return (
    <View className="bg-white border-b border-gray-300">
      {/* Top row */}
      <View className="flex-row items-center px-4 py-3">
        {/* Back arrow */}
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* Photo */}
        <Image
          source={{ uri: user.profilePhotoUrl || 'https://via.placeholder.com/50' }}
          className="w-12 h-12 rounded-full mr-3"
        />

        {/* Name + subTitle */}
        <TouchableOpacity onPress={toggleExpanded} className="flex-1">
          <Text className="font-bold text-base">
            {user.firstName} {user.lastName}
          </Text>
          <Text className="text-xs text-gray-500 mt-0.5">{subTitle}</Text>
        </TouchableOpacity>

        {/* Info circle only if expanded */}
        {isExpanded && (
          <TouchableOpacity onPress={() => { /* do nothing for now */ }}>
            <Ionicons name="information-circle-outline" size={24} color="#000" />
          </TouchableOpacity>
        )}
      </View>

      {/* If expanded => session detail panel */}
      {isExpanded && (
        <View className="px-4 pb-4">
          {/* Note */}
          <Text className="text-gray-600 text-sm mb-2">
            {currentSession.note || 'No additional details provided.'}
          </Text>

          {/* Date/Time row => center horizontally, bigger icons */}
          <View className="flex-row items-center justify-center bg-gray-100 rounded-lg p-4 mb-4">
            <Ionicons name="calendar" size={20} color="#000" style={{ marginRight: 6 }} />
            <Text className="text-sm text-black">{formattedDate}</Text>

            {/* faint vertical line */}
            <View className="mx-3 w-px bg-gray-300" />

            <Ionicons name="time" size={20} color="#000" style={{ marginRight: 6 }} />
            <Text className="text-sm text-black">{formattedTimeRange}</Text>
          </View>

          {/* Row #1: Change Time & Cancel side by side */}
          <View className="flex-row space-x-2 mb-3">
            {/* Change Time (black) */}
            <TouchableOpacity
              onPress={handleNavigateToRequestSession}
              className="flex-1 bg-black p-3 rounded-lg items-center"
            >
              <Text className="text-white font-bold text-sm">Change Time</Text>
            </TouchableOpacity>

            {/* Cancel (white w/ black border) */}
            <TouchableOpacity
              onPress={handleCancelSession}
              className="flex-1 bg-white border border-black p-3 rounded-lg items-center"
            >
              <Text className="text-black font-bold text-sm">Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Row #2: Book & total side by side => each half width */}
          <View className="flex-row space-x-2">
            {/* Book button (half width) */}
            <TouchableOpacity
              onPress={handleBookSession}
              disabled={isDisabled}
              className={`flex-1 p-3 rounded-lg items-center ${
                isDisabled ? 'bg-gray-300' : ''
              }`}
              style={{
                backgroundColor: isDisabled ? undefined : '#1A8BF8',
              }}
            >
              <Text
                className={`font-bold text-sm ${
                  isDisabled ? 'text-black' : 'text-white'
                }`}
              >
                {bookText}
              </Text>
            </TouchableOpacity>

            {/* Total (half width), aligned right */}
            <View className="flex-1 items-end justify-center">
              <Text className="text-sm font-bold text-black">{costLabel}</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ChatHeader;