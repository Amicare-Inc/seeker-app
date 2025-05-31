import React from 'react';
import { View, Text, Image, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import CustomButton from '@/components/Global/CustomButton';

export default function Index() {
	return (
		<View style={{ flex: 1, backgroundColor: '#fff' }}>
			{/* Hide status bar so the image fills the top */}
			<StatusBar hidden />

			<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
				{/* Top image container (covers top 60% of screen) */}
				<View
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						right: 0,
						height: '60%',
					}}
				>
					<Image
						source={require('@/assets/landing.png')}
						style={{
							width: '100%',
							height: '100%',
							resizeMode: 'cover',
						}}
					/>
					{/* Gradient overlay for a faded effect */}
					<LinearGradient
						colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']}
						style={{
							position: 'absolute',
							bottom: 0,
							left: 0,
							right: 0,
							height: '40%',
						}}
					/>
				</View>

				{/* Content container pushed down to the bottom third */}
				<View
					style={{
						flex: 1,
						justifyContent: 'flex-end',
						alignItems: 'center',
						padding: 16,
						paddingBottom: '50%',
					}}
				>
					<Text
						style={{
							fontSize: 38,
							fontWeight: '300',
							textAlign: 'center',
							marginBottom: 24,
						}}
						className="font-thin"
					>
						Connect with {'\n'} Trusted Personal {'\n'} Care Support
					</Text>
					<CustomButton
						title="Continue with Email"
						handlePress={() => router.push('/sign-in')}
						containerStyles="w-3/4 mt-6"
					/>
				</View>
			</ScrollView>
		</View>
	);
}
