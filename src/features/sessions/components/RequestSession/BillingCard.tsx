import React from 'react';
import { View, Text } from 'react-native';

interface BillingCardProps {
	basePrice: number;
	taxes: number;
	serviceFee: number;
	total: number;
	// NEW: hourly rate used for calculation
	hourlyRate: number;
}

const BillingCard: React.FC<BillingCardProps> = ({
	basePrice,
	taxes,
	serviceFee,
	total,
	hourlyRate,
}) => {
	return (
		<View className="bg-white p-3 rounded-xl mb-4">
			{/* Hourly Rate Row */}
			<View className="flex-row justify-between mb-1">
				<Text className="text-sm text-grey-58">Approximate Hourly Rate:</Text>
				<Text className="text-sm text-grey-58">${hourlyRate.toFixed(2)}/hr</Text>
			</View>
			{/* Base Price Row */}
			<View className="flex-row justify-between mb-1">
				<Text className="text-sm text-grey-58">Base Price:</Text>
				<Text className="text-sm text-grey-58">${basePrice.toFixed(2)}</Text>
			</View>
			{/* Taxes Row */}
			<View className="flex-row justify-between mb-1">
				<Text className="text-sm text-grey-58">Taxes:</Text>
				<Text className="text-sm text-grey-58">${taxes.toFixed(2)}</Text>
			</View>
			{/* Service Fee Row */}
			<View className="flex-row justify-between mb-2">
				<Text className="text-sm text-grey-58">Service Fee:</Text>
				<Text className="text-sm text-grey-58">${serviceFee.toFixed(2)}</Text>
			</View>
			{/* Total Row */}
			<View className="flex-row justify-between">
				<Text className="text-base font-medium">Total:</Text>
				<Text className="text-base font-medium">${total.toFixed(2)}</Text>
			</View>
		</View>
	);
};

export default BillingCard;
