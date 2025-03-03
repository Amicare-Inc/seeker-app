import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface DateTimeRowProps {
  label: string;
  dateLabel: string;
  timeLabel: string;
  onPressDate: () => void;
  onPressTime: () => void;
  disabled: boolean;
}

const DateTimeRow: React.FC<DateTimeRowProps> = ({
  label,
  dateLabel,
  timeLabel,
  onPressDate,
  onPressTime,
  disabled = false,
}) => {
  return (
    <>
    <Text className="text-sm font-semibold mb-2">{label}</Text>
    <View className="flex-row mb-4">
      <TouchableOpacity
        onPress={onPressDate}
        disabled={disabled}
        className={`flex-1 mr-2 p-3 border border-gray-300 rounded-lg items-center ${disabled ? 'bg-gray-200' : ''}`}
      >
        <Text className="text-base">{dateLabel}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onPressTime}
        disabled={disabled}
        className={`flex-1 p-3 border border-gray-300 rounded-lg items-center ${disabled ? 'bg-gray-200' : ''}`}
      >
        <Text className="text-base">{timeLabel}</Text>
      </TouchableOpacity>
    </View>
  </>
  );
};

export default DateTimeRow;