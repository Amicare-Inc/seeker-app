import React, { useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { User } from '@/types/User';

interface CareRecipientSelectorProps {
	familyMembers: User['familyMembers'];
	selectedRecipientId: string | null;
	onRecipientSelect: (recipientId: string | null, recipientData: any) => void;
	disabled?: boolean;
}

const CareRecipientSelector: React.FC<CareRecipientSelectorProps> = ({
	familyMembers = [],
	selectedRecipientId,
	onRecipientSelect,
	disabled = false
}) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const selectedRecipient = familyMembers?.find(member => member.id === selectedRecipientId);

	const handleRecipientSelect = (member: any) => {
		onRecipientSelect(member.id, member);
		setIsExpanded(false);
	};

	const renderFamilyMember = ({ item }: { item: any }) => (
		<TouchableOpacity
			onPress={() => handleRecipientSelect(item)}
			className="flex-row items-center p-3 border-b border-gray-100"
		>
			<View className="flex-1">
				<Text className="text-base font-medium text-gray-800">
					{item.firstName} {item.lastName}
				</Text>
				<Text className="text-sm text-gray-600">
					{item.relationshipToUser}
				</Text>
				<Text className="text-xs text-gray-500 mt-1">
					{item.address?.fullAddress}
				</Text>
			</View>
			{selectedRecipientId === item.id && (
				<Ionicons name="checkmark" size={20} color="#007AFF" />
			)}
		</TouchableOpacity>
	);

	if (!familyMembers || familyMembers.length === 0) {
		return null;
	}

	return (
		<View className="mb-4">
			<Text className="text-lg font-bold text-black mb-2">Care Recipient</Text>
			
			<TouchableOpacity
				onPress={() => setIsExpanded(!isExpanded)}
				disabled={disabled}
				className={`bg-grey-9 rounded-lg p-4 flex-row items-center justify-between ${
					disabled ? 'opacity-50' : ''
				}`}
			>
				<View className="flex-1">
					{selectedRecipient ? (
						<>
							<Text className="text-base font-medium text-gray-800">
								{selectedRecipient.firstName} {selectedRecipient.lastName}
							</Text>
							<Text className="text-sm text-gray-600">
								{selectedRecipient.relationshipToUser}
							</Text>
						</>
					) : (
						<Text className="text-base text-gray-500">
							Select family member
						</Text>
					)}
				</View>
				<Ionicons 
					name={isExpanded ? "chevron-up" : "chevron-down"} 
					size={20} 
					color="#666" 
				/>
			</TouchableOpacity>

			{isExpanded && (
				<View className="bg-white rounded-lg mt-2 border border-gray-200">
					<FlatList
						data={familyMembers}
						renderItem={renderFamilyMember}
						keyExtractor={(item) => item.id}
						scrollEnabled={false}
					/>
				</View>
			)}
		</View>
	);
};

export default CareRecipientSelector; 