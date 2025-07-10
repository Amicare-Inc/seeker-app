import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

    return (
        <View className="mb-4">
            {/* Stats Row */}
            <View className="border border-l-0 border-r-0 border-grey-9 py-4 mb-4">
                <View className="flex-row justify-between">
                    <View className="items-center flex-1">
                        <Text className="text-2xl font-bold text-black">4.8/5</Text>
                        <Text className="text-sm text-gray-600">Client Rating</Text>
                    </View>
                    <View className="items-center flex-1">
                        <Text className="text-2xl font-bold text-black">20</Text>
                        <Text className="text-sm text-gray-600">Total Sessions</Text>
                    </View>
                    <View className="items-center flex-1">
                        <Text className="text-2xl font-bold text-black">300</Text>
                        <Text className="text-sm text-gray-600">Total Hours</Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    wrapText: {
        flexWrap: 'wrap',
        color: '#797979',
    },
});

export default ProfileScore;