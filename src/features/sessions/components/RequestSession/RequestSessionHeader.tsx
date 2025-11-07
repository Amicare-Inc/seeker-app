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
		<View className="flex-row items-center px-4 py-3 border-b border-grey-9 background-white">
			<TouchableOpacity onPress={onBack} className="mr-2">
				<Ionicons name="chevron-back" size={24} color="#000" />
			</TouchableOpacity>
	
			<View className="flex-1">
				<Text className="text-lg font-bold">Request Session</Text>
			
			</View>
		</View>
	);
};

export default RequestSessionHeader;
