import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { User } from '@/types/User';

interface ProfileScoreProps {
    user: User;
}

const ProfileScore: React.FC<ProfileScoreProps> = ({ user }) => {
    const currentUser = useSelector((state: RootState) => state.user.userData);
    
    // Only show buttons if current user is PSW and viewing a seeker profile
    const shouldShowButtons = currentUser?.isPsw && !user.isPsw;
    
    const handleMessagePress = () => {
        // Message functionality (currently disabled)
    };

    const handleConnectPress = () => {
        // Connect functionality (to be implemented)
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
                        {/* Message Button - Greyed out */}
                        <TouchableOpacity 
                            onPress={handleMessagePress}
                            disabled={true}
                            className="items-center flex-1 bg-white rounded-lg py-4 opacity-50"
                            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 }}
                        >
                            <Ionicons name="chatbubble-outline" size={28} color="#000" />
                            <Text className="text-base text-black mt-2 font-medium">Message</Text>
                        </TouchableOpacity>

                        {/* Connect Button */}
                        <TouchableOpacity 
                            onPress={handleConnectPress}
                            className="items-center flex-1 bg-white rounded-lg py-4"
                            style={{ shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 3 }}
                        >
                            <Ionicons name="arrow-forward-outline" size={28} color="#000" />
                            <Text className="text-base text-black mt-2 font-medium">Connect</Text>
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