import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { EnrichedSession } from '@/types/EnrichedSession';
import { formatTimeRange } from '@/lib/datetimes/datetimeHelpers';

interface SeekerRequestCardProps {
    session: EnrichedSession;
    applicantsCount?: number;
    onPress: () => void;
}

const SeekerRequestCard: React.FC<SeekerRequestCardProps> = ({ session, onPress }) => {
    const startDate = session.startTime;
    const endDate = session.endTime;

    const weekday = startDate
        ? new Date(startDate).toLocaleDateString('en-US', { weekday: 'short' })
        : undefined;
    const timeRange = startDate && endDate ? formatTimeRange(startDate, endDate) : undefined;
    const dayTimeDisplay = weekday && timeRange ? `${weekday}. ${timeRange}` : 'Time TBD';

    // Prefer care recipient address when present, otherwise other user's address
    const address = session.careRecipient?.address || session.otherUser?.address;
    const locationText = address?.city && address?.province
        ? `${address.city}, ${address.province}`
        : 'Location TBD';

    return (
        <TouchableOpacity
            onPress={onPress}
            className="bg-white rounded-lg p-[14px] pl-[20px] mb-[12px] pr-[42px]"
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-1">
                    <Text className="font-bold text-base text-black" numberOfLines={1}>
                        {dayTimeDisplay}
                    </Text>
                    <Text className="text-sm font-medium text-gray-700 mt-[2px]" numberOfLines={1}>
                        {locationText}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default SeekerRequestCard;


