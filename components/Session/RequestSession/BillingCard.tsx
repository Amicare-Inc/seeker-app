import React from 'react';
import { View, Text } from 'react-native';

interface BillingCardProps {
	basePrice: number;
	taxes: number;
	serviceFee: number;
	total: number;
}

const BillingCard: React.FC<BillingCardProps> = ({
	basePrice,
	taxes,
	serviceFee,
	total,
}) => {
	return (
		<View className="bg-gray-100 p-4 rounded-lg mb-4">
			<Text className="text-base mb-1">
				Base Price: ${basePrice.toFixed(2)}
			</Text>
			<Text className="text-base mb-1">Taxes: ${taxes.toFixed(2)}</Text>
			<Text className="text-base mb-1">
				Service Fee: ${serviceFee.toFixed(2)}
			</Text>
			<View className="border-t border-gray-300 mt-2 pt-2">
				<Text className="text-base font-bold">
					Total: ${total.toFixed(2)}
				</Text>
			</View>
		</View>
	);
};

export default BillingCard;
