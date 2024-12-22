import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Session } from '@/types/Sessions';
import { User } from '@/types/User';

interface ChatHeaderProps {
  session: Session;
  user: User;
  isExpanded: boolean;
  toggleExpanded: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ session, user, isExpanded, toggleExpanded }) => {
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
            {session.note || 'No additional details provided.'}
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
            {/* Date Section */}
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
                {/* Placeholder for the Calendar Icon */}
                <Text style={{ fontSize: 16, color: '#000' }}>📅</Text>
              </View>
              <Text style={{ fontSize: 14, color: '#000' }}>
                {new Date(session.startTime || '').toLocaleDateString('en-US', {
                  weekday: 'short',
                  day: '2-digit',
                  month: 'short',
                })}
              </Text>
            </View>

            {/* Time Section */}
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
                {/* Placeholder for the Clock Icon */}
                <Text style={{ fontSize: 16, color: '#000' }}>⏰</Text>
              </View>
              <Text style={{ fontSize: 14, color: '#000' }}>
                {new Date(session.startTime || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                {new Date(session.endTime || '').toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
            <TouchableOpacity
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
              style={{
                borderColor: '#000',
                borderWidth: 1,
                flex: 1,
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: '#000', fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
          </View>

          {/* Status and Total Cost */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: '#888', fontSize: 14 }}>Awaiting confirmation</Text>
            <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#000' }}>
              Total Cost: ${session.billingDetails?.total.toFixed(2)}
            </Text>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default ChatHeader;