import React from 'react';
import { View, Text } from 'react-native';
import { User } from '@/types/User';

interface ProfileAvailabilityTableProps {
    user: User;
}

const ProfileAvailabilityTable: React.FC<ProfileAvailabilityTableProps> = ({ user }) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const timeSlots = ['8am - 12pm', '12pm - 5pm', '5pm - 10pm'];
    
    // Mock availability data - replace with actual user availability
    const availability = [
        [false, true, true, true, true, true, false], // 8am - 12pm
        [false, false, true, false, false, false, false], // 12pm - 5pm
        [false, false, false, false, false, false, false], // 5pm - 10pm
    ];

    return (
        <View className="mb-4">
            <Text className="font-bold text-black text-base mb-4">Availability</Text>
            
            <View>
                {/* Header Row */}
                <View className="flex-row mb-1">
                    <View className="w-24" />
                    {days.map((day, index) => (
                        <View key={index} className="flex-1 items-center">
                            <Text className="text-base font-medium text-grey-58">{day}</Text>
                        </View>
                    ))}
                </View>

                {/* Time Slots */}
                {timeSlots.map((timeSlot, rowIndex) => (
                    <View key={rowIndex} className="flex-row items-center mb-2">
                        <View className="w-24">
                            <Text className="text-sm text-grey-58 font-medium">{timeSlot}</Text>
                        </View>
                        {availability[rowIndex].map((isAvailable, colIndex) => (
                            <View key={colIndex} className="flex-1 items-center justify-center">
                                <View 
                                    className={`w-8 h-[18px] border border-grey-21 border-1 ${isAvailable ? 'bg-brand-blue' : 'bg-grey-9'}`}
                                />
                            </View>
                        ))}
                    </View>
                ))}
            </View>
        </View>
    );
};

export default ProfileAvailabilityTable;