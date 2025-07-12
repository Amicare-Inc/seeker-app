import React from 'react';
import { View, Text } from 'react-native';
import { User } from '@/types/User';

interface ProfileAvailabilityTableProps {
    user: User;
}

const ProfileAvailabilityTable: React.FC<ProfileAvailabilityTableProps> = ({ user }) => {
    const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const timeSlots = [
        { label: '8am - 12pm', start: '08:00', end: '12:00' },
        { label: '12pm - 5pm', start: '12:00', end: '17:00' },
        { label: '5pm - 10pm', start: '17:00', end: '22:00' }
    ];
    
    // Check if user is available during a specific time slot on a specific day
    const isAvailableAtTime = (dayName: string, slotStart: string, slotEnd: string): boolean => {
        const availability = user.carePreferences?.availability;
        if (!availability || !availability[dayName]) {
            return false;
        }

        const daySlots = availability[dayName];
        
        // Check if any of the user's time slots overlap with our display slot
        return daySlots.some(slot => {
            const userStart = slot.start;
            const userEnd = slot.end;
            
            // Convert time strings to minutes for easier comparison
            const toMinutes = (time: string) => {
                const [hours, minutes] = time.split(':').map(Number);
                return hours * 60 + minutes;
            };
            
            const userStartMin = toMinutes(userStart);
            const userEndMin = toMinutes(userEnd);
            const slotStartMin = toMinutes(slotStart);
            const slotEndMin = toMinutes(slotEnd);
            
            // Check for overlap: user slot overlaps with display slot
            return userStartMin < slotEndMin && userEndMin > slotStartMin;
        });
    };

    // If no availability data, show empty table
    if (!user.carePreferences?.availability) {
        return (
            <View className="mb-4">
                <Text className="font-bold text-black text-base mb-4">Availability</Text>
                <Text className="text-grey-58 text-sm">No availability information provided</Text>
            </View>
        );
    }

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
                            <Text className="text-sm text-grey-58 font-medium">{timeSlot.label}</Text>
                        </View>
                        {dayNames.map((dayName, colIndex) => {
                            const isAvailable = isAvailableAtTime(dayName, timeSlot.start, timeSlot.end);
                            return (
                                <View key={colIndex} className="flex-1 items-center justify-center">
                                    <View 
                                        className={`w-8 h-[18px] border border-grey-21 ${
                                            isAvailable ? 'bg-brand-blue' : 'bg-grey-9'
                                        }`}
                                    />
                                </View>
                            );
                        })}
                    </View>
                ))}
            </View>
        </View>
    );
};

export default ProfileAvailabilityTable;