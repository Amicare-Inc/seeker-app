// src/components/ChatHeader.tsx
import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View, Text, Image } from 'react-native';
import { router } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Session } from '@/types/Sessions';
import { User } from '@/types/User';
import { subscribeToSession, confirmSessionBooking, cancelSession } from '@/services/firebase/sessionService';

interface ChatHeaderProps {
  session: Session;
  user: User;
  isExpanded: boolean;
  toggleExpanded: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ session, user, isExpanded, toggleExpanded }) => {
  const currentUser = useSelector((state: RootState) => state.user.userData);
  const [currentSession, setCurrentSession] = useState<Session>(session);

  useEffect(() => {
    const unsubscribe = subscribeToSession(session.id, (updatedSession) => {
      setCurrentSession(updatedSession);
      console.log('Live session update:', updatedSession);
    });
    return () => unsubscribe();
  }, [session.id]);

  const isConfirmed = currentSession.status === 'confirmed';
  const isUserConfirmed = currentUser && currentSession.confirmedBy?.includes(currentUser.id);

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
    router.push({
      pathname: '/request-sessions',
      params: {
        targetUser: JSON.stringify(user),
        sessionObj: JSON.stringify(currentSession),
      },
    });
  };

  // Helper functions to format date and time.
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? 'Invalid Date'
      : date.toLocaleDateString('en-US', { weekday: 'short', day: '2-digit', month: 'short' });
  };

  const formatTime = (start: string, end: string) => {
    const s = new Date(start);
    const e = new Date(end);
    return isNaN(s.getTime()) || isNaN(e.getTime())
      ? 'Invalid Time'
      : `${s.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${e.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  const formattedDate = formatDate(currentSession.startTime || '');
  const formattedTime = formatTime(currentSession.startTime || '', currentSession.endTime || '');

  // Determine button style.
  const buttonBg = isConfirmed ? 'bg-green-500' : isUserConfirmed ? 'bg-gray-300' : 'bg-blue-500';
  const buttonText = isConfirmed ? 'Confirmed' : isUserConfirmed ? 'Waiting...' : 'Book';
  const textColor = (isConfirmed || isUserConfirmed) ? 'text-black' : 'text-white';

  return (
    <TouchableOpacity onPress={toggleExpanded} className={`bg-white p-4 ${isExpanded ? 'border-b border-gray-300' : ''}`}>
      <View className="flex-row items-center">
        <Image source={{ uri: user.profilePhotoUrl || 'https://via.placeholder.com/50' }} className="w-12 h-12 rounded-full mr-4" />
        <View className="flex-1">
          <Text className="font-bold text-lg">{`${user.firstName} ${user.lastName}`}</Text>
          <Text className="text-gray-500 text-sm">{currentUser?.isPsw ? 'Current Address' : user.address}</Text>
        </View>
      </View>
      {isExpanded && (
        <View className="mt-4">
          <Text className="text-gray-600 text-sm mb-2">
            {currentSession.note || 'No additional details provided.'}
          </Text>
          <View className="flex-row justify-between items-center bg-gray-100 rounded-lg p-3 mb-4">
            <View className="flex-row items-center">
              <View className="bg-gray-300 rounded-full p-2 mr-2">
                <Text>📅</Text>
              </View>
              <Text className="text-sm text-black">{formattedDate}</Text>
            </View>
            <View className="flex-row items-center">
              <View className="bg-gray-300 rounded-full p-2 mr-2">
                <Text>⏰</Text>
              </View>
              <Text className="text-sm text-black">{formattedTime}</Text>
            </View>
          </View>
          <View className="flex-row justify-between mb-4">
            <TouchableOpacity onPress={handleNavigateToRequestSession} className="bg-black flex-1 p-3 rounded-lg mr-2 items-center">
              <Text className="text-white font-bold text-sm">Change Time</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancelSession} className="bg-red-500 flex-1 p-3 rounded-lg items-center">
              <Text className="text-white font-bold text-sm">Cancel</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleBookSession} disabled={isConfirmed || !!isUserConfirmed} className={`p-3 rounded-lg items-center mb-4 ${buttonBg}`}>
            <Text className={`font-bold text-sm ${textColor}`}>{buttonText}</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ChatHeader;