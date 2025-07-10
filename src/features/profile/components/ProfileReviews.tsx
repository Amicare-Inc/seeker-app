// @/components/Profile/ProfileReviews.tsx
import React from 'react';
import { View, Text, FlatList } from 'react-native';

// Hard-coded sample reviews
const DUMMY_REVIEWS = [
	{
		id: '1',
		reviewer: 'Jane D',
		rating: '4.0',
		date: 'Sept 12, 2024',
		text: "Jane has been amazing, respectful, and always attentive to my mother's needs.",
	},
	{
		id: '2',
		reviewer: 'Mark T',
		rating: '4.5',
		date: 'Oct 5, 2024',
		text: 'Mark was punctual and provided excellent assistance with daily tasks.',
	},
	{
		id: '3',
		reviewer: 'Lucy B',
		rating: '5.0',
		date: 'Nov 15, 2024',
		text: 'Lucy went above and beyond in ensuring a comfortable experience.',
	},
];

const ProfileReviews: React.FC = () => {
	const renderReview = ({ item }: { item: (typeof DUMMY_REVIEWS)[0] }) => {
		return (
			<View className="bg-white border border-gray-200 rounded-lg p-4 mb-3">
				<Text className="text-sm font-bold text-black">
					{item.reviewer}
				</Text>
				<Text className="text-xs text-gray-500">
					{item.rating} | {item.date}
				</Text>
				<Text className="text-sm text-gray-700 mt-2">{item.text}</Text>
			</View>
		);
	};

	return (
		<View className="mb-4">
			<Text className="text-base font-bold text-black mb-2">Reviews</Text>
			{/* We disable scrolling on the FlatList so the parent ScrollView can scroll everything */}
			<FlatList
				data={DUMMY_REVIEWS}
				keyExtractor={(item) => item.id}
				renderItem={renderReview}
				scrollEnabled={false}
			/>
		</View>
	);
};

export default ProfileReviews;
