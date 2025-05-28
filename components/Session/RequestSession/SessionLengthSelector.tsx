import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SessionLengthSelectorProps {
	sessionLength: number;
	formatSessionLength: (length: number) => string;
	incrementBy30: () => void;
	incrementBy60: () => void;
	onReset: () => void; // new prop to reset session length
}

const SessionLengthSelector: React.FC<SessionLengthSelectorProps> = ({
	sessionLength,
	formatSessionLength,
	incrementBy30,
	incrementBy60,
	onReset,
}) => {
	return (
		<View className="mb-4">
			<Text className="text-sm font-semibold mb-2">
				Session Length (hrs)
			</Text>
			<View className="flex-row items-center">
				<Text className="text-lg font-bold mr-4">
					{formatSessionLength(sessionLength)}
				</Text>
				<TouchableOpacity
					onPress={incrementBy30}
					className="px-3 py-2 bg-gray-200 rounded-lg mr-2"
				>
					<Text className="text-sm font-bold">+0:30</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={incrementBy60}
					className="px-3 py-2 bg-gray-200 rounded-lg mr-2"
				>
					<Text className="text-sm font-bold">+1:00</Text>
				</TouchableOpacity>
				<TouchableOpacity
					onPress={onReset}
					className="px-3 py-2 bg-red-500 rounded-lg"
				>
					<Text className="text-sm font-bold text-white">Reset</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

export default SessionLengthSelector;
