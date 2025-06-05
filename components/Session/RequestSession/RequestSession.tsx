import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Keyboard,
    TextInput,
    ScrollView,
    Modal,
    Pressable,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useLocalSearchParams, router } from 'expo-router';
import { User } from '@/types/User';
import RequestSessionHeader from '@/components/Session/RequestSession/RequestSessionHeader';
import { mergeDateAndTime, roundDateTo15Min, enforceTwoHourBuffer } from '@/scripts/datetimeHelpers';
import { RootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import { requestSession, updateSession } from '@/services/node-express-backend/session';
import { SessionDTO } from '@/types/dtos/SessionDto';
import { Ionicons } from '@expo/vector-icons';
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

const helpOptions = [
    'Meal Prep',
    'Medical Appointment',
    'Grocery Shopping',
    'House Cleaning',
    'Transportation',
    'Personal Care',
    'Companionship',
];

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
    const [selectedHelpOptions, setSelectedHelpOptions] = useState<string[]>([]);
    const [showHelpDropdown, setShowHelpDropdown] = useState(false);
    
    // Checklist state
    const [checklistInput, setChecklistInput] = useState<string>('');
    const [checklistItems, setChecklistItems] = useState<string[]>([]);

    // Date and time state
    const [startDate, setStartDate] = useState<Date | null>(
        existingSession?.startTime ? new Date(existingSession.startTime) : null,
    );
    const [sessionLength, setSessionLength] = useState<number>(0); // in hours

    // Date picker state
    const [isDatePickerVisible, setDatePickerVisible] = useState(false);
    const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');

    const currentUser = useSelector((state: RootState) => state.user.userData);

    // Pricing calculations
    const basePrice = 156.00;
    const taxes = 24.20;
    const serviceFee = 40.00;
    const tasksCost = selectedHelpOptions.length * 10;
    const total = basePrice + taxes + serviceFee + tasksCost;

    const formatSessionLength = (lengthHrs: number) => {
        const hours = Math.floor(lengthHrs);
        const minutes = Math.round((lengthHrs - hours) * 60);
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    };

    const formatDate = (date: Date | null) => {
        if (!date) return 'Date';
        return date.toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const formatTime = (date: Date | null) => {
        if (!date) return 'Time';
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const showDatePicker = (mode: 'date' | 'time') => {
        setPickerMode(mode);
        setDatePickerVisible(true);
    };

    const hideDatePicker = () => setDatePickerVisible(false);

    const handleConfirm = (selectedDate: Date) => {
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
        hideDatePicker();
    };

    const incrementSessionLength = (hours: number) => {
        setSessionLength((prev) => prev + hours);
    };

    const toggleHelpOption = (option: string) => {
        setSelectedHelpOptions(prev => 
            prev.includes(option) 
                ? prev.filter(item => item !== option)
                : [...prev, option]
        );
    };

    const removeHelpOption = (option: string) => {
        setSelectedHelpOptions(prev => prev.filter(item => item !== option));
    };

    const addChecklistItem = () => {
        if (checklistInput.trim() && !checklistItems.includes(checklistInput.trim())) {
            setChecklistItems(prev => [...prev, checklistInput.trim()]);
            setChecklistInput('');
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
        if (selectedHelpOptions.length === 0) {
            alert('Please select what you need help with.');
            return;
        }
        if (!startDate) {
            alert('Please select a start date and time.');
            return;
        }
        if (sessionLength === 0) {
            alert('Please select a session length.');
            return;
        }

        try {
            const endDate = new Date(startDate.getTime() + sessionLength * 60 * 60 * 1000);
            const sessionData = {
                note: selectedHelpOptions.join(', '),
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
                checklist: checklistItems,
                billingDetails: {
                    basePrice,
                    taxes,
                    serviceFee,
                    tasksCost,
                    total,
                },
            };

            if (existingSession) {
                await updateSession(existingSession.id, sessionData);
                alert('Session updated successfully!');
                router.back();
            } else {
                const newSessionData = {
                    ...sessionData,
                    senderId: currentUser.id,
                    receiverId: targetUserObj?.id,
                } as SessionDTO;
                await requestSession(newSessionData);
                router.push({
                    pathname: '/sent-request',
                    params: {
                        otherUserId: targetUserObj?.id,
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
    return (
        <SafeAreaView className="flex-1 bg-white">
            <RequestSessionHeader
                onBack={() => router.back()}
                photoUrl={targetUserObj?.profilePhotoUrl || ''}
                firstName={targetUserObj?.firstName}
            />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="p-4 space-y-6">
                    {/* I need help with section */}
                    <View>
                        <TouchableOpacity
                            onPress={() => setShowHelpDropdown(true)}
                            className="bg-gray-100 rounded-full p-2 pl-4 flex-row items-center justify-between"
                        >
                            <Text className="text-gray-600 text-base">
                                {selectedHelpOptions.length > 0 ? selectedHelpOptions.join(', ') : 'I need help with...'}
                            </Text>
                            <Ionicons name="arrow-down-circle" size={34} color="#9CA3AF" />
                        </TouchableOpacity>
                        
                        {/* Selected options as pills */}
                        {selectedHelpOptions.length > 0 && (
                            <View className="flex-row flex-wrap gap-2 mt-3">
                                {selectedHelpOptions.map((option) => (
                                    <View
                                        key={option}
                                        className="bg-white border border-gray-300 px-3 py-1.5 rounded-full flex-row items-center"
                                    >
                                        <TouchableOpacity onPress={() => removeHelpOption(option)}>
                                            <Text className="text-blue-600 mr-1">×</Text>
                                        </TouchableOpacity>
                                        <Text className="text-sm text-gray-700">{option}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Starts section */}
                    <View className="flex-row items-center justify-between">
                        <Text className="text-gray-600 text-base mr-[75px]">Starts</Text>
                        <View className="flex-1 flex-row gap-3">
                            <TouchableOpacity
                                onPress={() => showDatePicker('date')}
                                className="flex-1 bg-gray-100 rounded-lg p-3"
                            >
                                <Text className="text-base text-black font-bold text-center">
                                    {formatDate(startDate)}
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => showDatePicker('time')}
                                className="flex-1 bg-gray-100 rounded-lg p-3"
                            >
                                <Text className="text-base text-black font-bold text-center">
                                    {formatTime(startDate)}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Session Length */}
                    <View>
                        <View className="flex-row items-center justify-between mb-3">
                            <Text className="text-gray-600 text-base">Session Length</Text>
                            <View className="flex-row items-center gap-2">
                                <TouchableOpacity
                                    onPress={() => incrementSessionLength(0.5)}
                                    className="bg-gray-100 rounded-xl px-3 py-2"
                                >
                                    <Text className="text-sm">+ 00:30</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => incrementSessionLength(1)}
                                    className="bg-gray-100 rounded-xl px-3 py-2"
                                >
                                    <Text className="text-sm">+ 01:00</Text>
                                </TouchableOpacity>
                                <View className="bg-transparent border border-grey-21 rounded-lg px-3 py-2">
                                    <Text className="text-base text-gray-400">
                                        {formatSessionLength(sessionLength)}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* Session Checklist */}
                    <View>
                        <Text className="text-black text-xl font-semibold mb-2">Session Checklist</Text>
                        <Text className="text-gray-600 text-base mb-4">
                            List all the specific tasks you would like accomplished during your session
                        </Text>
                        
                        <View className="bg-gray-100 rounded-full p-2 pl-4 flex-row items-center justify-between mb-3">
                            <TextInput
                                className="flex-1 text-base text-gray-600"
                                placeholder="e.g. Drive me to medical appt."
                                value={checklistInput}
                                onChangeText={setChecklistInput}
                                onSubmitEditing={addChecklistItem}
                                returnKeyType="done"
                            />
                            <TouchableOpacity onPress={addChecklistItem}>
                                <Ionicons name="arrow-down-circle" size={34} color="#9CA3AF" />
                            </TouchableOpacity>
                        </View>

                        {/* Checklist items as pills */}
                        {checklistItems.length > 0 && (
                            <View className="flex-row flex-wrap gap-2">
                                {checklistItems.map((item, index) => (
                                    <View
                                        key={index}
                                        className="bg-white border border-gray-300 px-3 py-1.5 rounded-full flex-row items-center"
                                    >
                                        <TouchableOpacity onPress={() => removeChecklistItem(item)}>
                                            <Text className="text-black mr-1">×</Text>
                                        </TouchableOpacity>
                                        <Text className="text-sm text-gray-700">{item}</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Pricing */}
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
                        {tasksCost > 0 && (
                            <View className="flex-row justify-between">
                                <Text className="text-gray-600">Additional Tasks ({selectedHelpOptions.length})</Text>
                                <Text className="text-black">${tasksCost.toFixed(2)}</Text>
                            </View>
                        )}
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
                        className="bg-brand-blue rounded-xl p-4 items-center flex-row justify-center"
                    >
                        <Ionicons name="paper-plane" size={24} color="white" style={{ marginRight: 8 }} />
                        <Text className="text-white text-xl font-semibold">
                            Send Request
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Help Options Modal */}
            <Modal
                visible={showHelpDropdown}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowHelpDropdown(false)}
            >
                <Pressable
                    className="flex-1 bg-black/50 justify-center items-center"
                    onPress={() => setShowHelpDropdown(false)}
                >
                    <View className="bg-white rounded-[14px] m-4 p-4 w-4/5">
                        <Text className="text-lg font-semibold mb-4">Select help options:</Text>
                        {helpOptions.map((option) => (
                            <TouchableOpacity
                                key={option}
                                onPress={() => toggleHelpOption(option)}
                                className="flex-row items-center justify-between py-3 border-b border-gray-100"
                            >
                                <Text className="text-base">{option}</Text>
                                {selectedHelpOptions.includes(option) && (
                                    <Ionicons name="checkmark" size={20} color="#3B82F6" />
                                )}
                            </TouchableOpacity>
                        ))}
                        <TouchableOpacity
                            onPress={() => setShowHelpDropdown(false)}
                            className="mt-4 bg-grey-94 rounded-xl p-3 items-center"
                        >
                            <Text className="text-white font-semibold">Done</Text>
                        </TouchableOpacity>
                    </View>
                </Pressable>
            </Modal>

            {/* Date Time Picker */}
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode={pickerMode}
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
                minuteInterval={15}
                minimumDate={new Date(Date.now() + 2 * 60 * 60 * 1000)}
            />
        </SafeAreaView>
    );
};

export default RequestSession;
