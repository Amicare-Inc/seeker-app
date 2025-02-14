import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { FIREBASE_AUTH } from '@/firebase.config';
import { Session } from '@/types/Sessions';
import { User } from '@/types/User';

// Import from your service file
import {
  subscribeToSession,
  confirmSessionBooking,
  cancelSession,
} from '@/services/firebase/sessionService';

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
  const currentUserId = FIREBASE_AUTH.currentUser?.uid;
  const [sessionData, setSessionData] = useState<Session>(session);

  // Real-time subscription to the session
  useEffect(() => {
    const unsubscribe = subscribeToSession(session.id, (updatedSession) => {
      setSessionData(updatedSession);
    });
    return () => unsubscribe();
  }, [session.id]);

  // Boolean helpers for UI
  const isBooked = sessionData.status === 'booked';
  const isCurrentUserConfirmed =
    !!currentUserId && sessionData.confirmedBy?.includes(currentUserId);

  // Handle "Book" action
  const handleBookSession = async () => {
    if (!currentUserId) return;
    try {
      await confirmSessionBooking(sessionData.id, currentUserId, sessionData.confirmedBy);
    } catch (error) {
      console.error('Error booking session:', error);
    }
  };

  // Handle "Cancel" action
  const handleCancelSession = async () => {
    try {
      await cancelSession(sessionData.id, sessionData.status);
      // Optionally, navigate back after cancel:
      router.back();
    } catch (error) {
      console.error('Error cancelling session:', error);
    }
  };

  // Handle "Change Time" action
  const handleNavigateToRequestSession = () => {
    router.push({
      pathname: '/request-sessions',
      params: {
        targetUser: JSON.stringify(user),
        sessionObj: JSON.stringify(sessionData),
      },
    });
  };

  return (
    <TouchableOpacity
      onPress={toggleExpanded}
      style={{
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderBottomWidth: isExpanded ? 1 : 0,
        borderBottomColor: '#ccc',
      }}
    >
      {/* Collapsed Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image
          source={{ uri: user.profilePhotoUrl || 'https://via.placeholder.com/50' }}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
            {user.firstName} {user.lastName}
          </Text>
          <Text style={{ color: '#666', fontSize: 14 }}>
            {user.isPsw ? 'Current Address' : user.address}
          </Text>
        </View>
      </View>

      {/* Expanded Section */}
      {isExpanded && (
        <View style={{ marginTop: 16 }}>
          {/* Optional note/details */}
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>
            {sessionData.note || 'No additional details provided.'}
          </Text>

          {/* Date and Time Row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
              backgroundColor: '#f4f4f4',
              borderRadius: 10,
              padding: 12,
            }}
          >
            {/* Date */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: '#e5e5e5',
                  borderRadius: 20,
                  padding: 8,
                  marginRight: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 16, color: '#000' }}>📅</Text>
              </View>
              <Text style={{ fontSize: 14, color: '#000' }}>
                {new Date(sessionData.startTime || '').toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                })}
              </Text>
            </View>

            {/* Time Range */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  backgroundColor: '#e5e5e5',
                  borderRadius: 20,
                  padding: 8,
                  marginRight: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 16, color: '#000' }}>⏰</Text>
              </View>
              <Text style={{ fontSize: 14, color: '#000' }}>
                {new Date(sessionData.startTime || '').toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}{' '}
                -{' '}
                {new Date(sessionData.endTime || '').toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </Text>
            </View>
          </View>

          {/* "Change Time" + "Cancel" in same row (optional) */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 16,
            }}
          >
            {/* Change Time Button */}
            <TouchableOpacity
              onPress={handleNavigateToRequestSession}
              style={{
                backgroundColor: '#000',
                flex: 1,
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
                marginRight: 8,
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Change Time</Text>
            </TouchableOpacity>

            {/* Cancel Button */}
            <TouchableOpacity
              onPress={handleCancelSession}
              style={{
                backgroundColor: '#FF3B30',
                flex: 1,
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Book Button */}
          <TouchableOpacity
            onPress={handleBookSession}
            style={{
              backgroundColor: isBooked
                ? '#4CAF50'
                : isCurrentUserConfirmed
                ? '#E5E5EA'
                : '#007AFF',
              padding: 12,
              borderRadius: 8,
              alignItems: 'center',
              marginBottom: 16,
            }}
            disabled={isBooked || isCurrentUserConfirmed}
          >
            <Text
              style={{
                color: isBooked || isCurrentUserConfirmed ? '#000' : '#fff',
                fontWeight: 'bold',
              }}
            >
              {isBooked ? 'Booked' : isCurrentUserConfirmed ? 'Waiting...' : 'Book'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ChatHeader;