import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { User } from '@/types/User';

interface ProfileScoreProps {
    user: User;
}

const ProfileScore: React.FC<ProfileScoreProps> = ({ user }) => {
    const isPsw = user.isPsw;

    const careTypeTitle = isPsw ? 'Experience with:' : 'Requiring help with:';
    const careType = user.carePreferences?.careType?.join(', ') || 'N/A';

    const tasksTitle = isPsw ? 'Assisting with:' : 'Seeking support with:';
    const tasks = user.carePreferences?.tasks?.join(', ') || 'N/A';

    const handleMessagePress = () => {
        // Message functionality (currently disabled)
    };

    const handleConnectPress = () => {
        // Connect functionality (to be implemented)
    };

    const handleReportPress = () => {
        // Report Issue functionality (to be implemented)
    };

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
};

export default ProfileScore;