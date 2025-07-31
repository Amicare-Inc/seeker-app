import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';

interface SessionCircleProps {
	photoURL: string;
	onPress: () => void;
	firstName: string;
}

const SessionCircle: React.FC<SessionCircleProps> = ({
	photoURL,
	onPress,
	firstName,
}) => {
	return (
		<TouchableOpacity onPress={onPress}>
			<View className="flex items-center justify-center mb-0 ml-2">
				<Image
					source={
						photoURL
							? { uri: photoURL }
							: require('@/assets/default-profile.png')
					}
					className="w-16 h-16 rounded-full border-2 border-blue-500"
				/>
				<Text className="text-black mt-2">{firstName}</Text>
			</View>
		</TouchableOpacity>
	);
};

export default SessionCircle;
