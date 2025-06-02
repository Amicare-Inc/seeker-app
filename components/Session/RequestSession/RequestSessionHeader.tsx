import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface RequestSessionHeaderProps {
	onBack: () => void;
	photoUrl: string;
	firstName: string;
}

const RequestSessionHeader: React.FC<RequestSessionHeaderProps> = ({
	onBack,
	photoUrl,
	firstName,
}) => {
	return (
		<View className="flex-row items-center px-4 py-3 border-b border-grey-21 background-white">
			<TouchableOpacity onPress={onBack} className="mr-2">
				<Ionicons name="chevron-back" size={24} color="#000" />
			</TouchableOpacity>
			<Image
				source={{ uri: photoUrl || 'https://via.placeholder.com/50' }}
				className="w-10 h-10 rounded-full mr-3"
			/>
			<View className="flex-1">
				<Text className="text-lg font-bold">Request Session</Text>
				<Text className="text-xs text-gray-500">with {firstName}</Text>
			</View>
		</View>
	);
};

export default RequestSessionHeader;
