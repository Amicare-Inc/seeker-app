import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface LocationDisplayProps {
	location: string;
	label?: string;
}

const LocationDisplay: React.FC<LocationDisplayProps> = ({ 
	location, 
	label = "Location" 
}) => {
	if (!location) {
		return null;
	}

	return (
		<View className="mb-4">
			<Text className="text-lg font-bold text-black mb-2">{label}</Text>
			<View className="bg-grey-9 rounded-lg p-4 flex-row items-center">
				<Ionicons name="location-outline" size={20} color="#666" className="mr-3" />
				<Text className="text-base text-gray-700 flex-1">
					{location}
				</Text>
			</View>
		</View>
	);
};

export default LocationDisplay; 