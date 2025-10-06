import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface SessionLengthSelectorProps {
	sessionLength: number;
	formatSessionLength: (length: number) => string;
	incrementBy30: () => void;
	incrementBy60: () => void;
	onReset: () => void; // new prop to reset session length
	disabled?: boolean;
}

const SessionLengthSelector: React.FC<SessionLengthSelectorProps> = ({
	sessionLength,
	formatSessionLength,
	incrementBy30,
	incrementBy60,
	onReset,
	disabled = false,
}) => {
	return (
		<View className="mb-4 flex-row items-center justify-between border-b pb-3 border-grey-9 w-[99%] mx-auto">
			<Text className="text-base font-semibold mb-2 text-grey-49">
				Length
			</Text>
			<View className="flex-row items-center">
				{!disabled && (
					<>
						<TouchableOpacity
							onPress={incrementBy30}
							className="px-3 py-2 bg-white rounded-xl mr-2"
						>
							<Text className="text-sm font-medium">+0:30</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={incrementBy60}
							className="px-3 py-2 bg-white rounded-xl mr-2"
						>
							<Text className="text-sm font-medium">+1:00</Text>
						</TouchableOpacity>
					</>
				)}
				<Text className="text-lg font-semibold border-2 px-3 py-1.5 rounded-xl border-grey-9 mr-2 text-grey-35">
					{formatSessionLength(sessionLength)}
				</Text>
				{!disabled && (
					<TouchableOpacity
						onPress={onReset}
						className="px-3 py-2  bg-black rounded-lg"
					>
						<Text className="text-sm font-bold text-white">Clear</Text>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

export default SessionLengthSelector;
