import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUserFields } from '@/redux/userSlice';
import { router } from 'expo-router';
import { RootState } from '@/redux/store';

export const useAvailability = () => {
	const dispatch = useDispatch();
	const userData = useSelector((state: RootState) => state.user.userData);
	const [selectedDays, setSelectedDays] = useState<{
		[day: string]: string[];
	}>({});
	const [activeDay, setActiveDay] = useState<string | null>(null);

	const toggleDay = (day: string) => {
		setActiveDay(activeDay === day ? null : day);
	};

	const toggleTime = (time: string) => {
		if (!activeDay) return;
		setSelectedDays((prev) => {
			const times = prev[activeDay] || [];
			const updatedTimes = times.includes(time)
				? times.filter((t) => t !== time)
				: [...times, time];
			const updatedDays = { ...prev, [activeDay]: updatedTimes };
			if (updatedTimes.length === 0) {
				delete updatedDays[activeDay];
			}
			return updatedDays;
		});
	};

	const resetAvailability = () => {
		setSelectedDays({});
		setActiveDay(null);
	};

	const formatAvailability = (selectedDays: { [day: string]: string[] }) => {
		const formatTime = (timeRange: string) => {
			const [start, end] = timeRange.split(' - ');
			return { start: start.trim(), end: end.trim() };
		};

		const formattedAvailability: {
			[day: string]: { start: string; end: string }[];
		} = {};

		for (const day in selectedDays) {
			formattedAvailability[day] = selectedDays[day].map(formatTime);
		}

		return formattedAvailability;
	};

	const saveAvailability = () => {
		const formattedAvailability = formatAvailability(selectedDays);

		dispatch(
			updateUserFields({
				carePreferences: {
					...userData?.carePreferences,
					availability: formattedAvailability,
				},
			}),
		);

		console.log('Availability saved successfully.', userData);
		
		// Check if user is looking for self or loved one to determine next step
		const lookingForSelf = userData?.carePreferences?.lookingForSelf;
		
		if (lookingForSelf === false) {
			// A Loved One flow - start with family member details
			// router.push('/caregiver_preferences'); should be this in future
			router.push('/about_loved_one');
		} else {
			// Myself flow - go to personal details first
			router.push('/personal_details');
		}
	};

	return {
		selectedDays,
		activeDay,
		toggleDay,
		toggleTime,
		resetAvailability,
		saveAvailability,
	};
};
