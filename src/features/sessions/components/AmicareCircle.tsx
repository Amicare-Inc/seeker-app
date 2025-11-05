import React from 'react';
import { View, Image, Text } from 'react-native';

interface AmicareCircleProps {
	firstName: string;
}

const AmicareCircle: React.FC<AmicareCircleProps> = ({ firstName }) => {
	return (
		<View className="flex items-center justify-center mb-0 ml-2">
			<Image
				source={require('@/assets/icon.png')}
				className="w-16 h-16 rounded-full border-2 border-blue-500"
			/>
			<Text className="text-black mt-2">{firstName}</Text>
		</View>
	);
};

export default AmicareCircle;
