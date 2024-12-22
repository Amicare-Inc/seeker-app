import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
} from 'react-native';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebase.config';
import { doc, updateDoc, arrayUnion, onSnapshot } from 'firebase/firestore';
import { router } from 'expo-router';
import { User } from '@/types/User';
import { Session } from '@/types/Sessions';

const ChatHeader: React.FC<{
  session: Session;
  user: User;
  isExpanded: boolean;
  toggleExpanded: () => void;
}> = ({ session, user, isExpanded, toggleExpanded }) => {
  const currentUserId = FIREBASE_AUTH.currentUser?.uid;

  const [sessionData, setSessionData] = useState<Session>(session);

  useEffect(() => {
    const sessionRef = doc(FIREBASE_DB, 'sessions', session.id);

    const unsubscribe = onSnapshot(sessionRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        setSessionData(docSnapshot.data() as Session);
      }
    });

    return () => unsubscribe();
  }, [session.id]);

  const handleBookSession = async () => {
    const sessionRef = doc(FIREBASE_DB, 'sessions', session.id);
    try {
      await updateDoc(sessionRef, {
        confirmedBy: arrayUnion(currentUserId),
      });

      if (sessionData.confirmedBy?.length === 1) {
        await updateDoc(sessionRef, { status: 'booked' });
      }
    } catch (error) {
      console.error('Error updating session:', error);
    }
  };

  const handleCancelSession = async () => {
    const sessionRef = doc(FIREBASE_DB, 'sessions', session.id);
    try {
      const newStatus = sessionData.status === 'booked' ? 'cancelled' : 'rejected';
      await updateDoc(sessionRef, { status: newStatus });
      router.back(); // Navigate back after cancelling
    } catch (error) {
      console.error('Error cancelling session:', error);
    }
  };

  const handleNavigateToRequestSession = () => {
    router.push({
      pathname: '/request-sessions', // Corrected the pathname
      params: {
        targetUser: JSON.stringify(user),
        sessionObj: JSON.stringify(sessionData),
      },
    });
  };

  const isCurrentUserConfirmed = currentUserId ? sessionData.confirmedBy?.includes(currentUserId) || false : false;
  const isBooked = sessionData.status === 'booked';

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
      {/* Initial Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: isExpanded ? 16 : 0 }}>
        <Image
          source={{ uri: user.profilePhotoUrl || 'https://via.placeholder.com/50' }}
          style={{ width: 50, height: 50, borderRadius: 25, marginRight: 16 }}
        />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#000' }}>{`${user.firstName} ${user.lastName}`}</Text>
          <Text style={{ color: '#666', fontSize: 14 }}>{user.isPSW ? 'Current Address' : user.address}</Text>
        </View>
      </View>

      {/* Expanded Header */}
      {isExpanded && (
        <View style={{ marginTop: 16 }}>
          {/* Notes */}
          <Text style={{ fontSize: 14, color: '#666', marginBottom: 10 }}>
            {sessionData.note || 'No additional details provided.'}
          </Text>

          {/* Date and Time Section */}
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
                {new Date(sessionData.startTime || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                {new Date(sessionData.endTime || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
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

          {/* Total Cost */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: '#888', fontSize: 14 }}>
              {isBooked ? 'Session is booked' : 'Awaiting confirmation'}
            </Text>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000' }}>
              Total Cost: ${sessionData.billingDetails?.total.toFixed(2)}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ChatHeader;