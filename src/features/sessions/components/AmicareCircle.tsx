import React from 'react';
import { Image, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { getAdminChatId } from '@/features/auth/api/adminChatApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

interface AmicareCircleProps {
	firstName?: string; // optional fallback
	onPress?: () => void;
}

const AmicareCircle: React.FC<AmicareCircleProps> = ({ firstName = 'Amicare', onPress }) => {
	const currentUser = useSelector((state: RootState) => state.user.userData);

	// Re-use the same cache key as admin-chat.tsx — no extra network call when already cached
	const { data: chatData } = useQuery({
		queryKey: ['adminChatId'],
		queryFn: async () => {
			const existing = await getAdminChatId();
			if (existing) return existing;
			return null;
		},
		enabled: !!currentUser?.id,
		staleTime: 1000 * 60 * 10, // 10 minutes — matches chat page behaviour
	});

	const displayName = chatData?.institutionName || firstName;

	const handlePress = () => {
		if (onPress) {
			onPress();
		} else {
			router.push('/(chat)/admin-chat');
		}
	};

	return (
		<TouchableOpacity className="items-center" onPress={handlePress} activeOpacity={0.7}>
			<Image
				source={require('@/assets/icon.png')}
				className="w-[78px] h-[78px] rounded-full border-4"
				style={{ borderColor: '#1A8BF8' }}
			/>
			<Text className="text-sm font-medium mb-[20px] mt-[5px]" style={{ color: '#00000099' }}>
				{displayName}
			</Text>
		</TouchableOpacity>
	);
};

export default AmicareCircle;
