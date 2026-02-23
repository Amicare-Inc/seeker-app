import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export interface InstitutionCircleProps {
    institutionId: string;
    institutionName: string;
    /** Existing chat ID; null means the chat hasn't been created yet. */
    chatId?: string | null;
    onPress?: () => void;
}

/**
 * A single circle badge for one institution.
 * Render one of these per institution to create a horizontal list
 * of institution contacts (in AppliedSessions, PendingSessions, SessionList).
 */
const InstitutionCircle: React.FC<InstitutionCircleProps> = ({
    institutionId,
    institutionName,
    chatId,
    onPress,
}) => {
    const handlePress = () => {
        if (onPress) {
            onPress();
            return;
        }
        router.push({
            pathname: '/(chat)/admin-chat',
            params: {
                institutionId,
                institutionName,
                chatId: chatId ?? '',
            },
        });
    };

    return (
        <TouchableOpacity className="items-center" onPress={handlePress} activeOpacity={0.7}>
            <Image
                source={require('@/assets/icon.png')}
                className="w-[78px] h-[78px] rounded-full border-4"
                style={{ borderColor: '#1A8BF8' }}
            />
            <Text
                className="text-sm font-medium mb-[20px] mt-[5px]"
                style={{ color: '#00000099' }}
                numberOfLines={1}
            >
                {institutionName}
            </Text>
        </TouchableOpacity>
    );
};

export default InstitutionCircle;
