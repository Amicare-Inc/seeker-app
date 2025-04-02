// app/index.tsx
import React, { useState } from 'react';
import {
	SafeAreaView,
	View,
	TextInput,
	TouchableOpacity,
	Text,
	Alert,
} from 'react-native';
import { router } from 'expo-router';

export default function Index() {
	const [input, setInput] = useState('');

	const handleNext = () => {
		if (input.trim().toLowerCase() === 'qwerty') {
			router.push('/index2');
		} else {
			Alert.alert('Incorrect input');
		}
	};

	return (
		<SafeAreaView
			style={{
				flex: 1,
				backgroundColor: 'white',
				justifyContent: 'center',
				alignItems: 'center',
			}}
		>
			<View style={{ width: '80%', alignItems: 'center' }}>
				<TextInput
					value={input}
					onChangeText={setInput}
					placeholder="Type here..."
					style={{
						width: '100%',
						height: 50,
						borderWidth: 1,
						borderColor: '#ccc',
						paddingHorizontal: 10,
						marginBottom: 20,
						borderRadius: 8,
					}}
				/>
				<TouchableOpacity
					onPress={handleNext}
					style={{
						backgroundColor: '#1A8BF8',
						paddingVertical: 15,
						paddingHorizontal: 40,
						borderRadius: 8,
					}}
				>
					<Text style={{ color: 'white', fontWeight: 'bold' }}>
						Next
					</Text>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
