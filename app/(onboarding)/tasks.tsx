import React, { useState } from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/firebase.config';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { router } from 'expo-router';

const TaskSelection: React.FC = () => {
    const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
    const [user] = useAuthState(FIREBASE_AUTH);

    const taskOptions = [
        'Option 1',
        'Option 2',
        'Option 3',
        'Option 4',
        'Option 5',
        'Option 6',
        'Option 7',
        'Option 8',
    ];

    const toggleTask = (task: string) => {
        setSelectedTasks((prev) =>
            prev.includes(task) ? prev.filter((t) => t !== task) : [...prev, task]
        );
    };

    const handleDone = async () => {
        if (user) {
            try {
                const userDocRef = doc(FIREBASE_DB, 'personal', user.uid);

                // Update `carePreferences.tasks` in Firestore
                await updateDoc(userDocRef, {
                    'carePreferences.tasks': selectedTasks,
                });

                router.push('/availability');
            } catch (error) {
                console.error('Failed to save tasks:', error);
            }
        } else {
            alert('User not authenticated.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
                <View className="px-6">
                    {/* Header */}
                    <Text className="text-lg font-bold text-black mb-4">
                        What kind of tasks would you like help with?
                    </Text>

                    {/* Task Options */}
                    <View className="flex-wrap flex-row justify-between">
                        {taskOptions.map((task, index) => (
                            <CustomButton
                                key={task}
                                title={task}
                                handlePress={() => toggleTask(task)}
                                containerStyles={`w-full mb-4 py-4 rounded-xl border ${
                                    selectedTasks.includes(task)
                                        ? 'border-blue-500 bg-blue-500'
                                        : 'border-gray-200 bg-gray-200'
                                }`}
                                textStyles={`text-base ${
                                    selectedTasks.includes(task) ? 'text-white' : 'text-black'
                                }`}
                            />
                        ))}
                    </View>

                    {/* Done Button */}
                    <CustomButton
                        title="Done"
                        handlePress={handleDone}
                        containerStyles="mt-8 bg-black py-4 rounded-full"
                        textStyles="text-white text-lg"
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default TaskSelection;