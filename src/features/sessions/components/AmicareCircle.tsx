import React from 'react';
import { View, Image, Text } from 'react-native';

interface AmicareCircleProps {
	firstName: string;
}

const AmicareCircle: React.FC<AmicareCircleProps> = ({ firstName }) => {
	return (
		<View className="items-center">
			<Image
				source={require('@/assets/icon.png')}
				className="w-[78px] h-[78px] rounded-full border-4"
				style={{ borderColor: '#1A8BF8' }}
			/>
			<Text className="text-sm font-medium mb-[20px] mt-[5px]" style={{ color: '#00000099' }}>
				{firstName}
			</Text>
		</View>
	);
};

export default AmicareCircle;
