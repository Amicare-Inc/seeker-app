import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { User } from '@/types/User';
import { useRequestSession, useEnrichedSessions } from '@/features/sessions/api/queries';
import { SessionDTO } from '@/types/dtos/SessionDto';
import { router } from 'expo-router';

interface ProfileScoreProps {
    user: User;
}

const ProfileScore: React.FC<ProfileScoreProps> = ({ user }) => {
    const currentUser = useSelector((state: RootState) => state.user.userData);
    const [isConnecting, setIsConnecting] = useState(false);
    const requestSessionMutation = useRequestSession();
    
    // Get all sessions for the current user to check for existing sessions
    const { data: allSessions = [] } = useEnrichedSessions(currentUser?.id);
    
    // Only show buttons if current user is PSW and viewing a seeker profile
    const shouldShowButtons = currentUser?.isPsw && !user.isPsw;
    
    // Check if there's an existing active session between PSW and this seeker
    const hasActiveSession = allSessions.some(session => {
        // Get the actual user ID (strip family member suffix if present)
        const seekerUserId = user.isFamilyMemberCard && user.id 
            ? user.id.split('-family-')[0] 
            : user.id;
        
        // Check if this session involves the current seeker
        const isSessionWithThisSeeker = session.senderId === seekerUserId || 
                                       session.receiverId === seekerUserId;
        
        // Check if session is in an active state
        const isActiveStatus = ['newRequest', 'pending', 'confirmed', 'inProgress'].includes(session.status);
        
        return isSessionWithThisSeeker && isActiveStatus;
    });

    const handleConnectPress = async () => {
        if (!currentUser) {
            Alert.alert('Error', 'You must be signed in to express interest.');
            return;
        }

        if (isConnecting || hasActiveSession) {
            return; // Prevent double-clicks
        }

        setIsConnecting(true);

        try {
            // Determine care recipient information
            const careRecipientId = user.isFamilyMemberCard && user.familyMemberInfo 
                ? user.familyMemberInfo.id 
                : user.id;
            
            const careRecipientType = user.isFamilyMemberCard ? 'family' : 'self';
            
            // Get the actual user ID (strip family member suffix if present)
            const receiverId = user.isFamilyMemberCard && user.id 
                ? user.id.split('-family-')[0] 
                : user.id;

            if (!currentUser.id || !receiverId) {
                throw new Error('Missing required user information');
            }

            const interestedSessionData: SessionDTO = {
                senderId: currentUser.id,
                receiverId: receiverId,
                careRecipientId: careRecipientId,
                careRecipientType: careRecipientType,
                note: 'PSW expressing interest in providing care'
            };

            await requestSessionMutation.mutateAsync(interestedSessionData);
            
            Alert.alert(
                'Interest Sent',
                'Your interest has been sent successfully. The care seeker will be notified.',
                [{ text: 'OK', onPress: () => {
                    // Navigate back to PSW home after expressing interest
                    router.replace('/(dashboard)/(psw)/psw-home');
                } }]
            );
        } catch (error: any) {
            console.error('Error expressing interest:', error);
            Alert.alert(
                'Error',
                error.message || 'Failed to send interest. Please try again.',
                [{ text: 'OK' }]
            );
        } finally {
            setIsConnecting(false);
        }
    };

    const handleReportPress = () => {
        // Report Issue functionality (to be implemented)
    };

    if (shouldShowButtons) {
        // Show buttons for PSWs viewing seeker profiles
        return (
            <View className="mb-6">
                {/* Action Buttons Row */}
                <View className="py-2 mb-4">
                    <View className="flex-row justify-between gap-4">
                        {/* Connect Button */}
                        <TouchableOpacity 
                            onPress={handleConnectPress}
                            disabled={isConnecting || hasActiveSession}
                            className={`items-center flex-1 bg-white rounded-lg py-4 ${(isConnecting || hasActiveSession) ? 'opacity-50' : ''}`}
                            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 }}
                        >
                            <Ionicons 
                                name={isConnecting ? "hourglass-outline" : hasActiveSession ? "checkmark-outline" : "arrow-forward-outline"} 
                                size={28} 
                                color="#000" 
                            />
                            <Text className="text-base text-black mt-2 font-medium">
                                {isConnecting ? 'Connecting...' : hasActiveSession ? 'Already Connected' : 'Connect'}
                            </Text>
                        </TouchableOpacity>

                        {/* Report Issue Button */}
                        <TouchableOpacity 
                            onPress={handleReportPress}
                            className="items-center flex-1 bg-white rounded-lg py-4"
                            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 }}
                        >
                            <Ionicons name="alert-circle-outline" size={28} color="#000" />
                            <Text className="text-base text-black mt-2 font-medium">Report Issue</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        );
    }

    // Show stats for seekers viewing PSW profiles (original implementation)
    return (
        <View className="mb-6">
            {/* Stats Row */}
            <View className="bg-white rounded-lg p-4 mb-4" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 }}>
                <View className="flex-row justify-between">
                    {/* Total Sessions */}
                    <View className="items-center flex-1">
                        <Text className="text-2xl font-bold text-black">47</Text>
                        <Text className="text-sm text-gray-600 mt-1">Total Sessions</Text>
                    </View>

                    {/* Total Hours */}
                    <View className="items-center flex-1">
                        <Text className="text-2xl font-bold text-black">156</Text>
                        <Text className="text-sm text-gray-600 mt-1">Total Hours</Text>
                    </View>

                    {/* Client Rating */}
                    <View className="items-center flex-1">
                        <Text className="text-2xl font-bold text-black">4.8</Text>
                        <Text className="text-sm text-gray-600 mt-1">Client Rating</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ProfileScore;