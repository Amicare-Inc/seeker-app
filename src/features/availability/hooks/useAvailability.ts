import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/redux/store';
import { setUserData, setTempAvailability, clearTempAvailability } from '@/redux/userSlice';
import { router } from 'expo-router';

export const useAvailability = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userData = useSelector((state: RootState) => state.user.userData);
    const tempAvailability = useSelector((state: RootState) => state.user.tempAvailability);
    
    // Initialize with existing availability data
    const [availability, setAvailability] = useState<{
        [days: string]: { start: string; end: string }[];
    }>(userData?.carePreferences?.availability || {});

    // Helper function to convert time string to minutes since midnight
    const timeToMinutes = (time: string): number => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // Helper function to convert minutes to time string
    const minutesToTime = (minutes: number): string => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    // Merge overlapping intervals
    const mergeIntervals = (intervals: { start: string; end: string }[]): { start: string; end: string }[] => {
        if (intervals.length <= 1) return intervals;

        // Convert to minutes, sort by start time
        const minuteIntervals = intervals
            .map(interval => ({
                start: timeToMinutes(interval.start),
                end: timeToMinutes(interval.end)
            }))
            .sort((a, b) => a.start - b.start);

        const merged = [minuteIntervals[0]];

        for (let i = 1; i < minuteIntervals.length; i++) {
            const current = minuteIntervals[i];
            const lastMerged = merged[merged.length - 1];

            // If current interval overlaps or touches the last merged interval
            if (current.start <= lastMerged.end) {
                lastMerged.end = Math.max(lastMerged.end, current.end);
            } else {
                merged.push(current);
            }
        }

        // Convert back to time strings
        return merged.map(interval => ({
            start: minutesToTime(interval.start),
            end: minutesToTime(interval.end)
        }));
    };

    const addTimeSlot = (day: string, start: string, end: string) => {
        setAvailability(prev => {
            const daySlots = prev[day] || [];
            const newSlots = [...daySlots, { start, end }];
            const mergedSlots = mergeIntervals(newSlots);
            
            return {
                ...prev,
                [day]: mergedSlots
            };
        });
    };

    const removeTimeSlot = (day: string, index: number) => {
        setAvailability(prev => ({
            ...prev,
            [day]: prev[day]?.filter((_, i) => i !== index) || []
        }));
    };

    const clearDay = (day: string) => {
        setAvailability(prev => ({
            ...prev,
            [day]: []
        }));
    };

    const clearAll = () => {
        setAvailability({});
    };

    const saveAvailability = () => {
        // Store availability in tempAvailability for later use
        dispatch(setTempAvailability(availability));
        
        // Navigate based on user type - check isPsw first
        const { isPsw, lookingForSelf } = userData || {};
        
        if (isPsw) {
            // PSWs go to personal details (their provider flow)
            router.push('/personal_details');
        } else if (lookingForSelf === false) {
            // Family care seeker - go to about loved one
            router.push('/about_loved_one');
        } else {
            // Self-care seeker - go to personal details
            router.push('/personal_details');
        }
    };

    return {
        availability,
        addTimeSlot,
        removeTimeSlot,
        clearDay,
        clearAll,
        saveAvailability
    };
};
