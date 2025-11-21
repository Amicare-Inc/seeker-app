import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { User } from '@/types/User';
import { useRequestSession, useEnrichedSessions } from '@/features/sessions/api/queries';
import { SessionDTO } from '@/types/dtos/SessionDto';
import { router } from 'expo-router';
import { AuthApi } from '@/features/auth/api/authApi';
import { updateUserFields } from '@/redux/userSlice';

interface ProfileScoreProps {
    user: User;
}

const ProfileScore: React.FC<ProfileScoreProps> = ({ user }) => {
    const currentUser = useSelector((state: RootState) => state.user.userData);
    const dispatch = useDispatch();
    const [isConnecting, setIsConnecting] = useState(false);
    const requestSessionMutation = useRequestSession();
    
    // Get all sessions for the current user to check for existing sessions
    const { data: allSessions = [] } = useEnrichedSessions(currentUser?.id);
    
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

    

    // Show stats for seekers viewing PSW profiles (original implementation)
    return (
        <View className="mb-6">
            {/* Stats Row */}
            <View className="bg-white rounded-lg p-4 mb-4" style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 }}>
                <View className="flex-row justify-between">
                    {/* Total Sessions */}
                    <View className="items-center flex-1">
                        <Text className="text-2xl font-bold text-black">{user.totalSessions || 0}</Text>
                        <Text className="text-sm text-gray-600 mt-1">Total Sessions</Text>
                    </View>

                    {/* Total Hours */}
                    <View className="items-center flex-1">
                        <Text className="text-2xl font-bold text-black">{user.totalCareHours || 0}</Text>
                        <Text className="text-sm text-gray-600 mt-1">Total Hours</Text>
                    </View>

                    {/* Client Rating */}
                    <View className="items-center flex-1">
                        <Text className="text-2xl font-bold text-black">{user.rating?.toFixed(1) || 'N/A'}</Text>
                        <Text className="text-sm text-gray-600 mt-1">Client Rating</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ProfileScore;