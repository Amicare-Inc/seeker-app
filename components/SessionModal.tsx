// SessionModal.tsx
import React from 'react';
import { Modal, TouchableOpacity, View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import UserCardExpanded from './UserCardExpanded';
import { User } from '@/types/User';

interface SessionModalProps {
	isVisible: boolean;
	onClose: () => void;
	onAction: (action: 'accept' | 'reject') => void;
	user: User | null;
	isConfirmed?: boolean;
	isPending?: boolean;
}

const SessionModal: React.FC<SessionModalProps> = ({
	isVisible,
	onClose,
	onAction,
	user,
	isConfirmed,
	isPending,
}) => {
	if (!user) return null;

	return (
		<Modal
			transparent
			visible={isVisible}
			animationType="fade"
			onRequestClose={onClose}
		>
			<BlurView
				style={{
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}
				tint="light"
				intensity={50}
			>
				<View className="w-full h-full justify-center items-center">
					<TouchableOpacity
						onPress={onClose}
						className="bg-transparent w-11/12 rounded-lg p-0"
					>
						<UserCardExpanded user={user} onPress={onClose} />
					</TouchableOpacity>

					<View className="mt-4 w-full px-6">
						<TouchableOpacity
							onPress={() => onAction('accept')}
							className="bg-blue-500 py-3 rounded-lg"
						>
							<Text className="text-white text-center text-lg">
								Accept
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={() => onAction('reject')}
							className="bg-red-500 py-3 rounded-lg mt-2"
						>
							<Text className="text-white text-center text-lg">
								Reject
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</BlurView>
		</Modal>
	);
};

export default SessionModal;
