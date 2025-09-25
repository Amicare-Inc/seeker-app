import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/redux/store';
import { setUserDoc, getUserDoc } from '@/services/firebase/firestore';
import { updateUserFields } from '@/redux/userSlice';

const days = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun', 'Reset'];
const times = [
  '6 am - 8 am', '8 am - 10 am', '10 am - 12 pm', '12 pm - 2 pm', '2 pm - 4 pm', '4 pm - 6 pm'
];

const CareScheduleScreen = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.userData);
  const [loading, setLoading] = useState(true);
  const [dayTimes, setDayTimes] = useState<{ [day: string]: string[] }>({});
  const [currentDay, setCurrentDay] = useState<string | null>(null);

  // Load availability from backend on mount
  useEffect(() => {
    const fetchAvailability = async () => {
      if (!userData?.id) return;
      setLoading(true);
      try {
        const userDoc = await getUserDoc(userData.id);
        const avail = userDoc?.carePreferences?.availability || {};
        // Convert backend format to UI format (full day names to short)
        const dayMap: { [key: string]: string } = { Monday: 'Mon', Tuesday: 'Tues', Wednesday: 'Wed', Thursday: 'Thurs', Friday: 'Fri', Saturday: 'Sat', Sunday: 'Sun' };
        const newDayTimes: { [day: string]: string[] } = {};
        Object.entries(avail).forEach(([fullDay, slots]: [string, any]) => {
          const shortDay = dayMap[fullDay] || fullDay;
          newDayTimes[shortDay] = (slots || []).map((slot: any) => {
            // Map time ranges to string labels
            const timeMap: { [key: string]: string } = {
              '06:00-08:00': '6 am - 8 am',
              '08:00-10:00': '8 am - 10 am',
              '10:00-12:00': '10 am - 12 pm',
              '12:00-14:00': '12 pm - 2 pm',
              '14:00-16:00': '2 pm - 4 pm',
              '16:00-18:00': '4 pm - 6 pm',
            };
            const key = `${slot.start}-${slot.end}`;
            return timeMap[key] || '';
          }).filter(Boolean);
        });
        setDayTimes(newDayTimes);
      } catch (e) {
        Alert.alert('Error', 'Failed to load care schedule.');
      }
      setLoading(false);
    };
    fetchAvailability();
  }, [userData?.id]);

  const toggleDay = (day: string) => {
    if (day === 'Reset') {
      setDayTimes({});
      setCurrentDay(null);
      return;
    }
    // If switching from a day with no times, remove it from selection
    if (currentDay && (!dayTimes[currentDay] || dayTimes[currentDay].length === 0)) {
      const newDayTimes = { ...dayTimes };
      delete newDayTimes[currentDay];
      setDayTimes(newDayTimes);
    }
    setCurrentDay(day);
  };

  const toggleTime = (time: string) => {
    if (!currentDay) return;
    const times = dayTimes[currentDay] || [];
    let newTimes;
    if (times.includes(time)) {
      newTimes = times.filter(t => t !== time);
    } else {
      newTimes = [...times, time];
    }
    setDayTimes({ ...dayTimes, [currentDay]: newTimes });
  };

  // Helper: get selected days
  const selectedDays = Object.keys(dayTimes).filter(day => dayTimes[day] && dayTimes[day].length > 0);

  // Convert UI state to backend format
  // Helper: convert time string to minutes
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  // Helper: convert minutes to time string
  const minutesToTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  // Merge overlapping or adjacent intervals
  const mergeIntervals = (intervals: { start: string; end: string }[]) => {
    if (intervals.length <= 1) return intervals;
    const minuteIntervals = intervals
      .map(interval => ({ start: timeToMinutes(interval.start), end: timeToMinutes(interval.end) }))
      .sort((a, b) => a.start - b.start);
    const merged = [minuteIntervals[0]];
    for (let i = 1; i < minuteIntervals.length; i++) {
      const current = minuteIntervals[i];
      const lastMerged = merged[merged.length - 1];
      if (current.start <= lastMerged.end) {
        lastMerged.end = Math.max(lastMerged.end, current.end);
      } else {
        merged.push(current);
      }
    }
    return merged.map(interval => ({ start: minutesToTime(interval.start), end: minutesToTime(interval.end) }));
  };

  const toBackendAvailability = () => {
    const dayMap: { [key: string]: string } = { Mon: 'Monday', Tues: 'Tuesday', Wed: 'Wednesday', Thurs: 'Thursday', Fri: 'Friday', Sat: 'Saturday', Sun: 'Sunday' };
    const timeMap: { [key: string]: { start: string; end: string } } = {
      '6 am - 8 am': { start: '06:00', end: '08:00' },
      '8 am - 10 am': { start: '08:00', end: '10:00' },
      '10 am - 12 pm': { start: '10:00', end: '12:00' },
      '12 pm - 2 pm': { start: '12:00', end: '14:00' },
      '2 pm - 4 pm': { start: '14:00', end: '16:00' },
      '4 pm - 6 pm': { start: '16:00', end: '18:00' },
    };
    const backend: { [day: string]: { start: string; end: string }[] } = {};
    Object.entries(dayTimes).forEach(([shortDay, slots]) => {
      const fullDay = dayMap[shortDay] || shortDay;
      // Map UI slots to intervals
      const intervals = (slots || [])
        .map(label => timeMap[label])
        .filter(Boolean);
      // Merge intervals for this day
      backend[fullDay] = mergeIntervals(intervals);
    });
    return backend;
  };

  // Save to backend
  const handleUpdate = async () => {
    if (!userData?.id) return;
    const availability = toBackendAvailability();
    try {
      const updatedUser = {
        ...userData,
        carePreferences: {
          ...userData.carePreferences,
          availability,
        },
      };
      await setUserDoc(userData.id, updatedUser);
      dispatch(updateUserFields(updatedUser));
      Alert.alert('Success', 'Care schedule updated.');
      router.back();
    } catch (e: any) {
      Alert.alert('Error', 'Failed to update care schedule.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F7F8FA' }}>
      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={24} color="black" />
          </TouchableOpacity>
          <Text style={{ flex: 1, textAlign: 'center', fontSize: 20, fontWeight: '500' }}>Care Schedule</Text>
        </View>
        <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 12 }}>
          On which days do you usually need care?
          <Text style={{ fontWeight: '400' }}>
            {'\n'}Select all that apply:
          </Text>
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
          {days.map(day => (
            <TouchableOpacity
              key={day}
              onPress={() => toggleDay(day)}
              style={{
                backgroundColor: (selectedDays.includes(day) || currentDay === day) ? '#3B82F6' : '#fff',
                borderRadius: 20,
                paddingVertical: 10,
                paddingHorizontal: 18,
                marginRight: 8,
                marginBottom: 8,
                borderWidth: 1,
                borderColor: '#E9E9EA',
              }}
            >
              <Text style={{ color: (selectedDays.includes(day) || currentDay === day) ? '#fff' : '#303031', fontWeight: '500' }}>{day}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {currentDay && (
          <>
            <Text style={{ fontSize: 16, fontWeight: '500', marginBottom: 12 }}>
              At roughly what times on <Text style={{ fontWeight: '700' }}>{currentDay}</Text> do you need care?
              <Text style={{ fontWeight: '400' }}>
                {'\n'}Select all that apply:
              </Text>
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
              {times.map(time => (
                <TouchableOpacity
                  key={time}
                  onPress={() => toggleTime(time)}
                  style={{
                    backgroundColor: (dayTimes[currentDay] || []).includes(time) ? '#3B82F6' : '#fff',
                    borderRadius: 20,
                    paddingVertical: 10,
                    paddingHorizontal: 18,
                    marginRight: 8,
                    marginBottom: 8,
                    borderWidth: 1,
                    borderColor: '#E9E9EA',
                  }}
                >
                  <Text style={{ color: (dayTimes[currentDay] || []).includes(time) ? '#fff' : '#303031', fontWeight: '500' }}>{time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
          <Ionicons name="information-circle-outline" size={20} color="#BFBFC3" style={{ marginRight: 8, marginTop: 2 }} />
          <Text style={{ fontSize: 13, color: '#303031' }}>
            We use your care preferences to <Text style={{ backgroundColor: '#FFF500' }}>personal</Text>ize your match. This info is confidential and only shared with your consent. By continuing, you agree to our{' '}
            <Text style={{ color: '#007AFF' }} onPress={() => {}} >Privacy Policy</Text> and{' '}
            <Text style={{ color: '#007AFF' }} onPress={() => {}} >Terms of Use</Text>.
          </Text>
        </View>
        <TouchableOpacity
          style={{ backgroundColor: '#18181B', borderRadius: 8, padding: 16, alignItems: 'center', marginBottom: 24 }}
          onPress={handleUpdate}
          disabled={loading}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '500' }}>Update</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CareScheduleScreen;
