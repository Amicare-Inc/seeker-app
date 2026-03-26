import React from 'react';
import { View, Text } from 'react-native';
import { CustomButton } from '@/shared/components';
import {
	CARE_TYPE_OPTIONS,
	CARE_TYPE_TO_TASKS,
} from '@/shared/constants/carePreferencesOnboarding';

type Props = {
	selectedTasks: string[];
	onToggleTask: (task: string) => void;
};

/**
 * Onboarding-style picker: one flow — tasks grouped under category headings.
 */
const CarePreferencesCategorySections: React.FC<Props> = ({
	selectedTasks,
	onToggleTask,
}) => (
	<>
		{CARE_TYPE_OPTIONS.map((category) => (
			<View key={category} className="mb-5">
				<Text className="text-base font-semibold text-grey-80 mb-3">
					{category}
				</Text>
				<View className="flex-col">
					{(CARE_TYPE_TO_TASKS[category] || []).map((task) => (
						<CustomButton
							key={task}
							title={task}
							handlePress={() => onToggleTask(task)}
							containerStyles={`mb-[10px] rounded-full w-full min-h-[44px] h-[44px] ${
								selectedTasks.includes(task) ? 'bg-brand-blue' : 'bg-white'
							}`}
							textStyles={`text-sm font-medium ${
								selectedTasks.includes(task) ? 'text-white' : 'text-black'
							}`}
						/>
					))}
				</View>
			</View>
		))}
	</>
);

export default CarePreferencesCategorySections;
