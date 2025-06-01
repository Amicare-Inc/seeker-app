import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Keyboard,
    TextInput,
    ScrollView,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { doc, setDoc, updateDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '@/firebase.config';
import { useLocalSearchParams, router } from 'expo-router';
import { User } from '@/types/User';
import RequestSessionHeader from '@/components/Session/RequestSession/RequestSessionHeader';
import { mergeDateAndTime, roundDateTo15Min, enforceTwoHourBuffer } from '@/scripts/datetimeHelpers';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { requestSession, updateSession } from '@/services/node-express-backend/session';
import { SessionDTO } from '@/types/dtos/SessionDto';
import { Ionicons } from '@expo/vector-icons';

interface SessionData {
    id: string;
    senderId: string;
    receiverId: string;
    participants: string[];
    status: string;
    createdAt: string;
    confirmedBy: string[];
    note?: string;
    startTime?: string;
    endTime?: string;
    billingDetails?: {
        basePrice: number;
        taxes: number;
        serviceFee: number;
        total: number;
    };
}

const RequestSession = () => {
    const { otherUserId, sessionObj } = useLocalSearchParams();
    const targetUserObj: User = useSelector(
        (state: RootState) =>
            state.userList.users.find(
                (user) => user.id === otherUserId,
            ) as User,
    );
    const existingSession: SessionData | null = sessionObj
        ? JSON.parse(sessionObj as string)
        : null;

    // Help options state
    const [helpText, setHelpText] = useState<string>(
        existingSession?.note || '',
    );
    const [selectedHelpOptions, setSelectedHelpOptions] = useState<string[]>([]);
    
    // Checklist state
    const [checklistText, setChecklistText] = useState<string>('');
    const [checklistItems, setChecklistItems] = useState<string[]>([]);

    const [startDate, setStartDate] = useState<Date | null>(
        existingSession?.startTime ? new Date(existingSession.startTime) : null,
    );
    const [endDate, setEndDate] = useState<Date | null>(
        existingSession?.endTime ? new Date(existingSession.endTime) : null,
    );
    const [sessionLength, setSessionLength] = useState<number>(0);

    // For date/time picker.
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
    const [pickerTarget, setPickerTarget] = useState<'start' | 'end'>('start');

    const currentUser = useSelector((state: RootState) => state.user.userData);
    const pswRate = currentUser?.isPsw
        ? currentUser.rate || 20
        : targetUserObj?.isPsw
            ? targetUserObj?.rate || 20
            : 20;

    const basePrice = pswRate * sessionLength;
    const taxes = basePrice * 0.13;
    const serviceFee = basePrice * 0.1;
    const total = basePrice + taxes + serviceFee;

    // Predefined help options
    const helpOptions = ['Meal Prep', 'Medical Appointment', 'Grocery Shopping', 'House Cleaning', 'Transportation'];
    const checklistSuggestions = ['Drive me to appt.', 'Wait for me during appointment', 'Drive me back home', 'Meal Prep'];

    useEffect(() => {
        if (startDate && endDate) {
            const diffMs = endDate.getTime() - startDate.getTime();
            const diffHours = diffMs / (1000 * 60 * 60);
            setSessionLength(Math.max(diffHours, 0));
        }
    }, []);

    useEffect(() => {
        if (startDate && sessionLength > 0) {
            const newEnd = new Date(
                startDate.getTime() + sessionLength * 60 * 60 * 1000,
            );
            setEndDate(newEnd);
        }
    }, [sessionLength, startDate]);

    const formatSessionLength = (lengthHrs: number) => {
        const hours = Math.floor(lengthHrs);
        const minutes = Math.round((lengthHrs - hours) * 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const showDatePicker = (target: 'start' | 'end', mode: 'date' | 'time') => {
        setPickerTarget(target);
        setPickerMode(mode);
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => setDatePickerVisible(false);

    const handleConfirm = (selectedDate: Date) => {
        if (pickerTarget === 'start') {
            let newStart: Date;
            if (pickerMode === 'date') {
                newStart = startDate
                    ? mergeDateAndTime(selectedDate, startDate)
                    : selectedDate;
            } else {
                newStart = startDate
                    ? mergeDateAndTime(startDate, selectedDate)
                    : selectedDate;
            }
            newStart = roundDateTo15Min(newStart);
            newStart = enforceTwoHourBuffer(newStart);
            setStartDate(newStart);
            if (sessionLength > 0) {
                setEndDate(
                    new Date(
                        newStart.getTime() + sessionLength * 60 * 60 * 1000,
                    ),
                );
            }
        } else {
            let newEnd: Date;
            if (pickerMode === 'date') {
                newEnd = endDate
                    ? mergeDateAndTime(selectedDate, endDate)
                    : selectedDate;
            } else {
                newEnd = endDate
                    ? mergeDateAndTime(endDate, selectedDate)
                    : selectedDate;
            }
            newEnd = roundDateTo15Min(newEnd);
            setEndDate(newEnd);
            if (startDate) {
                const diffMs = newEnd.getTime() - startDate.getTime();
                setSessionLength(diffMs / (1000 * 60 * 60));
            }
        }
        hideDatePicker();
    };

    const incrementSessionLength = (hours = 0.5) => {
        setSessionLength((prev) => prev + hours);
    };

    const formatDate = (date: Date | null) => {
        if (!date) return 'Select Date';
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (date: Date | null) => {
        if (!date) return 'Select Time';
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const toggleHelpOption = (option: string) => {
        setSelectedHelpOptions(prev => 
            prev.includes(option) 
                ? prev.filter(item => item !== option)
                : [...prev, option]
        );
    };

    const addChecklistItem = (item: string) => {
        if (!checklistItems.includes(item)) {
            setChecklistItems(prev => [...prev, item]);
        }
    };

    const removeChecklistItem = (item: string) => {
        setChecklistItems(prev => prev.filter(i => i !== item));
    };

    const handleSubmit = async () => {
        Keyboard.dismiss();
        if (!currentUser) {
            alert('You must be signed in to send a request.');
            return;
        }
        if (!helpText.trim()) {
            alert('Please specify what you need help with.');
            return;
        }
        if (!startDate || !endDate) {
            alert('Please select both start and end times.');
            return;
        }
        try {
            const sessionData = {
                note: helpText,
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                billingDetails: {
                    dynamicBasePrice: basePrice,
                    taxes,
                    serviceFee,
                    total,
                },
            };
            if (existingSession) {
                console.log('session id', existingSession.id);
                await updateSession(existingSession.id, {
                    ...sessionData,
                    billingDetails: {
                        ...sessionData.billingDetails,
                        basePrice: sessionData.billingDetails.dynamicBasePrice,
                    },
                });
                alert('Session updated successfully!');
                router.back();
            } else {
                const newSessionData = {
                    ...sessionData,
                    senderId: currentUser.id,
                    receiverId: targetUserObj?.id,
                    billingDetails: {
                        ...sessionData.billingDetails,
                        basePrice: sessionData.billingDetails.dynamicBasePrice,
                    },
                } as SessionDTO;
                await requestSession(newSessionData);
                router.push({
                    pathname: '/sent-request',
                    params: {
                        otherUserId: targetUserObj?.id, // so we can display their name/pic
                    },
                });
            }
        } catch (error) {
            console.error('Error submitting session request:', error);
            alert('An error occurred while sending your request.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <RequestSessionHeader
                onBack={() => router.back()}
                photoUrl={targetUserObj?.profilePhotoUrl || ''}
                firstName={targetUserObj?.firstName}
            />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-4 space-y-6">
                    {/* Help Section */}
                    <View>
                        <View className="bg-gray-100 rounded-lg p-4 mb-3">
                            <TextInput
                                className="text-base text-gray-600"
                                placeholder="I need help with..."
                                value={helpText}
                                onChangeText={setHelpText}
                                multiline
                            />
                            <TouchableOpacity className="absolute right-4 top-4">
                                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>
                        
                        {/* Help Options Tags */}
                        <View className="flex-row flex-wrap gap-2">
                            {helpOptions.map((option) => (
                                <TouchableOpacity
                                    key={option}
                                    onPress={() => toggleHelpOption(option)}
                                    className={`px-3 py-1.5 rounded-full border ${
                                        selectedHelpOptions.includes(option)
                                            ? 'bg-blue-100 border-blue-300'
                                            : 'bg-white border-gray-300'
                                    }`}
                                >
                                    <View className="flex-row items-center">
                                        {selectedHelpOptions.includes(option) && (
                                            <Text className="text-blue-600 mr-1">×</Text>
                                        )}
                                        <Text className={`text-sm ${
                                            selectedHelpOptions.includes(option)
                                                ? 'text-blue-600'
                                                : 'text-gray-700'
                                        }`}>
                                            {option}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Date and Time */}
                    <View>
                        <Text className="text-gray-600 text-base mb-3">Starts</Text>
                        <View className="flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => showDatePicker('start', 'date')}
                                className="flex-1 bg-gray-100 rounded-lg p-3"
                            >
                                <Text className="text-base text-black text-center">
                                    {formatDate(startDate)}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => showDatePicker('start', 'time')}
                                className="flex-1 bg-gray-100 rounded-lg p-3"
                            >
                                <Text className="text-base text-black text-center">
                                    {formatTime(startDate)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Session Length */}
                    <View>
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-gray-600 text-base">Session Length</Text>
                            <View className="flex-row items-center gap-3">
                                <TouchableOpacity
                                    onPress={() => incrementSessionLength(0.5)}
                                    className="bg-gray-100 rounded-lg px-3 py-1"
                                >
                                    <Text className="text-sm">+ 00:30</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => incrementSessionLength(1)}
                                    className="bg-gray-100 rounded-lg px-3 py-1"
                                >
                                    <Text className="text-sm">+ 01:00</Text>
                                </TouchableOpacity>
                                <View className="bg-gray-100 rounded-lg px-3 py-1">
                                    <Text className="text-sm text-gray-400">
                                        {formatSessionLength(sessionLength)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Session Checklist */}
                    <View>
                        <Text className="text-black text-lg font-semibold mb-2">Session Checklist</Text>
                        <Text className="text-gray-600 text-sm mb-4">
                            List all the specific tasks you would like accomplished during your session
                        </Text>
                        
                        <View className="bg-gray-100 rounded-lg p-4 mb-3">
                            <TextInput
                                className="text-base text-gray-600"
                                placeholder="e.g. Drive me to medical appt."
                                value={checklistText}
                                onChangeText={setChecklistText}
                                onSubmitEditing={() => {
                                    if (checklistText.trim()) {
                                        addChecklistItem(checklistText.trim());
                                        setChecklistText('');
                                    }
                                }}
                            />
                            <TouchableOpacity className="absolute right-4 top-4">
                                <Ionicons name="chevron-down" size={20} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        {/* Checklist Items */}
                        <View className="flex-row flex-wrap gap-2">
                            {checklistItems.map((item, index) => (
                                <TouchableOpacity
                                    key={index}
                                    onPress={() => removeChecklistItem(item)}
                                    className="bg-white border border-gray-300 px-3 py-1.5 rounded-full"
                                >
                                    <View className="flex-row items-center">
                                        <Text className="text-blue-600 mr-1">×</Text>
                                        <Text className="text-sm text-gray-700">{item}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                            
                            {/* Suggestion chips */}
                            {checklistSuggestions
                                .filter(suggestion => !checklistItems.includes(suggestion))
                                .map((suggestion) => (
                                <TouchableOpacity
                                    key={suggestion}
                                    onPress={() => addChecklistItem(suggestion)}
                                    className="bg-white border border-gray-300 px-3 py-1.5 rounded-full"
                                >
                                    <Text className="text-sm text-gray-700">{suggestion}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Billing */}
                    <View className="space-y-3">
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Base Price</Text>
                            <Text className="text-black">${basePrice.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Taxes</Text>
                            <Text className="text-black">${taxes.toFixed(2)}</Text>
                        </View>
                        <View className="flex-row justify-between">
                            <Text className="text-gray-600">Service Fee</Text>
                            <Text className="text-black">${serviceFee.toFixed(2)}</Text>
                        </View>
                        <View className="border-t border-gray-200 pt-3">
                            <View className="flex-row justify-between">
                                <Text className="text-black font-semibold">Total</Text>
                                <Text className="text-black font-semibold">${total.toFixed(2)}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Submit Button */}
                    <TouchableOpacity
                        onPress={handleSubmit}
                        className="bg-blue-600 rounded-lg p-4 items-center flex-row justify-center"
                    >
                        <Ionicons name="paper-plane" size={20} color="white" style={{ marginRight: 8 }} />
                        <Text className="text-white text-base font-semibold">
                            Send Request
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode={pickerMode}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                minuteInterval={15}
                minimumDate={
                    pickerTarget === 'start'
                        ? startDate &&
                            startDate.toDateString() !==
                                new Date().toDateString()
                            ? new Date(
                                    startDate.getFullYear(),
                                    startDate.getMonth(),
                                    startDate.getDate(),
                                    0,
                                    0,
                                    0,
                                )
                            : new Date(Date.now() + 2 * 60 * 60 * 1000)
                        : startDate || new Date()
                }
            />
        </SafeAreaView>
    );
};

export default RequestSession;
