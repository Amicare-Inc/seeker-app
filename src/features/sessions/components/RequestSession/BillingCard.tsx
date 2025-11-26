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
		<View className="bg-grey-0 rounded-xl mb-2">
			{/* Base Price Row */}
			<View className="flex-row justify-between mb-2">
				<Text className="text-sm text-grey-58">Base Price</Text>
				<Text className="text-sm text-grey-80 font-medium">${basePrice.toFixed(2)}</Text>
			</View>
			{/* Taxes Row */}
			<View className="flex-row justify-between mb-2">
				<Text className="text-sm text-grey-58">Taxes</Text>
				<Text className="text-sm text-grey-80 font-medium">${taxes.toFixed(2)}</Text>
			</View>
			{/* Service Fee Row */}
			<View className="flex-row justify-between mb-3">
				<Text className="text-sm text-grey-58">Service Fee</Text>
				<Text className="text-sm text-grey-80 font-medium">${serviceFee.toFixed(2)}</Text>
			</View>
			{/* Total Row */}
			<View className="flex-row justify-between pt-2 border-t border-grey-9">
				<Text className="text-base font-semibold text-grey-80">Total</Text>
				<Text className="text-base font-bold text-grey-80">${total.toFixed(2)}</Text>
			</View>
		</View>
	);
};

export default BillingCard;
