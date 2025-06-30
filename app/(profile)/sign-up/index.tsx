import React from 'react';
import { View, Text, Image, ScrollView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import CustomButton from '@/components/Global/CustomButton';

export default function Index() {
	return (
		<View style={{ flex: 1, backgroundColor: '#F2F2F7' }}>
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
						colors={['rgba(242,242,247,0)', 'rgba(242,242,247,1)']}
						style={{
							position: 'absolute',
							bottom: 0,
							left: 0,
							right: 0,
							height: '50%',
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
						paddingBottom: '15%',
					}}
				>
					<Text
						style={{
							fontSize: 38,
							fontWeight: '400',
							textAlign: 'center',
							marginBottom: 30,
						}}
						className=""
					>
						Connect with {'\n'} Trusted Personal {'\n'} Care Support
					</Text>
					<CustomButton
						title="Sign Up with Phone"
						handlePress={() => router.push('/sign-up')}
						containerStyles="w-full mb-4"
						textStyles='font-medium'
						iconName="call"
					/>
					<CustomButton
						title="Sign Up with Email"
						handlePress={() => router.push('/sign-up')}
						containerStyles="w-full bg-white border border-1 border-grey-9 mb-12"
						textStyles='font-medium text-black'
						iconName="mail"
						iconColor="black"
					/>
					<Text style={{ textAlign: 'center' }}>
						Already have an account?{' '}
						<Text
							style={{ 
								textDecorationLine: 'underline',
								color: 'black',
								fontWeight: '600'
							}}
							onPress={() => router.push('/sign-in')}
							suppressHighlighting={true}
						>
							Log In!
						</Text>
					</Text>
				</View>
			</ScrollView>
		</View>
	);
}
