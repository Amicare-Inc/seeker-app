import helpOptions from '@/assets/helpOptions';

/** Care Needs 1 — same list as onboarding. */
export const CARE_TYPE_OPTIONS: string[] = [
	'Household Tasks',
	'Personal Care & Mobility',
	'Social & Cognitive Support',
	'Transportation',
];

const CARE_TYPE_TO_TASKS_MAP: Record<string, string[]> = {
	'Personal Care & Mobility': [
		'Bathing',
		'Dressing',
		'Toileting',
		'Incontinence care',
		'Bed chair transfer',
		'Ambulation support',
		'Range of support',
		'Fall prevention',
	],
	'Household Tasks': [
		'Light housekeeping',
		'Laundry',
		'Grocery shopping',
		'Meal planning',
		'Meal preparation',
		'Nutrition tracking',
	],
	'Social & Cognitive Support': [
		'Conversation',
		'Recreation hobbies',
		'Memory games',
		'Tech help',
		'Event accompaniment',
	],
	Transportation: [
		'Medical appointments',
		'Errands and shopping',
		'Social and community outings',
	],
};

/**
 * Care Needs 2 — task choices match signup: union of tasks for selected care types,
 * or all tasks if none selected (same as onboarding fallback).
 */
export function getTaskOptionsForCareTypes(selectedCareTypes: string[]): string[] {
	if (!selectedCareTypes.length) {
		const allTasks: string[] = [];
		Object.values(CARE_TYPE_TO_TASKS_MAP).forEach((tasks) => {
			tasks.forEach((task) => {
				if (!allTasks.includes(task)) allTasks.push(task);
			});
		});
		return allTasks.length > 0 ? allTasks : [...helpOptions];
	}
	const availableTasks: string[] = [];
	selectedCareTypes.forEach((careType) => {
		const tasksForType = CARE_TYPE_TO_TASKS_MAP[careType] || [];
		tasksForType.forEach((task) => {
			if (!availableTasks.includes(task)) availableTasks.push(task);
		});
	});
	return availableTasks.length > 0 ? availableTasks : [...helpOptions];
}
