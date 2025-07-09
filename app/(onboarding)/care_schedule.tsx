import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import CustomButton from '@/components/Global/CustomButton';
import { useAvailability } from '@/hooks/useAvailability';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const days = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];
const timeslots = [
	'8 am - 10 am',
	'10 am - 12 pm',
	'12 pm - 2 pm',
	'2 pm - 4 pm',
	'4 pm - 6 pm',
	'6 pm - 8 pm',
];

const CareSchedule: React.FC = () => {
	const {
		selectedDays,
		activeDay,
		toggleDay,
		toggleTime,
		resetAvailability,
		saveAvailability,
	} = useAvailability();

	return (
		<SafeAreaView className="flex-1 bg-grey-0">
			<ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
				<View className="px-[16px]">
					{/* Header */}
					<View className="flex-row items-center mb-[39px]">
						<TouchableOpacity className="absolute" onPress={() => router.back()}>
							<Ionicons name="chevron-back" size={24} color="#000" />
						</TouchableOpacity>
						<Text className="text-xl font-semibold mx-auto">
							3/4 Care Schedule
						</Text>
					</View>

					{/* Question */}
					<Text className="text-lg text-grey-80 mb-[34px]">
						On which days do you usually need care?{'\n'}Select all that apply:
					</Text>

					{/* Day Selection */}
					<View className="flex-wrap flex-row mb-[36px] justify-between">
						{days.map((day) => (
							<CustomButton
								key={day}
								title={day}
								handlePress={() => toggleDay(day)}
								containerStyles={`w-[82px] h-[44px] rounded-full mb-[10px] min-h-[44px] ${
									selectedDays[day]?.length > 0
										? 'bg-brand-blue'
										: 'bg-white'
								}`}
								textStyles={`text-sm font-medium ${
									selectedDays[day]?.length > 0
										? 'text-white'
										: 'text-black'
								}`}
							/>
						))}
						<CustomButton
							title="Reset"
							handlePress={resetAvailability}
							containerStyles="w-[82px] h-[44px] rounded-full min-h-[44px] bg-white"
							textStyles="text-sm font-medium text-black"
						/>
					</View>

					{/* Time Slot Selection */}
					{activeDay && (
						<View className="">
							<Text className="text-lg text-grey-80 mb-[36px]">
								At roughly what times on{' '}
								<Text className="font-bold">
									{
										{
											Mon: 'Monday',
											Tues: 'Tuesday',
											Wed: 'Wednesday',
											Thurs: 'Thursday',
											Fri: 'Friday',
											Sat: 'Saturday',
											Sun: 'Sunday'
										}[activeDay]
									}
								</Text>{' '}
								do you need care? Select all that apply:
							</Text>
							<View className="flex-wrap flex-row -mr-[10px]">
								{timeslots.map((time) => (
									<CustomButton
										key={time}
										title={time}
										handlePress={() => toggleTime(time)}
										containerStyles={`mb-[10px] mr-[10px] rounded-full w-[174px] h-[44px] min-h-[44px] ${
											(selectedDays[activeDay] || []).includes(time)
												? 'bg-brand-blue'
												: 'bg-white'
										}`}
										textStyles={`text-sm font-medium ${
											(selectedDays[activeDay] || []).includes(time)
												? 'text-white'
												: 'text-black'
										}`}
									/>
								))}
							</View>
						</View>
					)}

				</View>
			</ScrollView>

			{/* Update Button */}
			<View className="px-[16px]">
				{/* Privacy Notice */}
				<View className="flex-row justify-center mx-auto px-[16px]">
					<Ionicons
						name="information-circle"
						size={30}
						color="#BFBFC3"
					/>
					<Text className="text-xs text-grey-49 mb-[21px] ml-[16px] font-medium">
						We use your care preferences to personalize your match. This info is confidential and only shared with your consent. By continuing, you agree to our{' '}
						<Text className="text-brand-blue">Privacy Policy</Text> and <Text className="text-brand-blue">Terms of Use</Text>.
					</Text>
				</View>
				<CustomButton
					title="Update"
					handlePress={saveAvailability}
					containerStyles="bg-black py-4 rounded-lg"
					textStyles="text-white text-xl font-medium"
				/>
			</View>
		</SafeAreaView>
	);
};

export default CareSchedule;
