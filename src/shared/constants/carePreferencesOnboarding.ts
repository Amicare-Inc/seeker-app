import helpOptions from '@/assets/helpOptions';

/** Care Needs 1 — same list as onboarding. */
export const CARE_TYPE_OPTIONS: string[] = [
	'Household Tasks',
	'Personal Care & Mobility',
	'Social & Cognitive Support',
	'Transportation',
];

/** Tasks grouped by care category (Care Needs 1 headers → Care Needs 2 options). */
export const CARE_TYPE_TO_TASKS: Record<string, string[]> = {
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

/** Categories that have at least one selected task (for persisting `careType`). */
export function deriveCareTypesFromTasks(selectedTasks: string[]): string[] {
	const set = new Set(selectedTasks);
	return CARE_TYPE_OPTIONS.filter((cat) =>
		(CARE_TYPE_TO_TASKS[cat] || []).some((t) => set.has(t)),
	);
}

/** Non-empty groups for profile display (category → tasks user selected). */
export function groupSelectedTasksByCategory(
	selectedTasks: string[],
): { category: string; tasks: string[] }[] {
	const set = new Set(selectedTasks);
	const groups = CARE_TYPE_OPTIONS.map((category) => ({
		category,
		tasks: (CARE_TYPE_TO_TASKS[category] || []).filter((t) => set.has(t)),
	})).filter((g) => g.tasks.length > 0);
	const inGroup = new Set(groups.flatMap((g) => g.tasks));
	const orphans = selectedTasks.filter((t) => !inGroup.has(t));
	if (orphans.length > 0) {
		groups.push({ category: 'Other', tasks: orphans });
	}
	return groups;
}

/**
 * Care Needs 2 — task choices match signup: union of tasks for selected care types,
 * or all tasks if none selected (same as onboarding fallback).
 */
export function getTaskOptionsForCareTypes(selectedCareTypes: string[]): string[] {
	if (!selectedCareTypes.length) {
		const allTasks: string[] = [];
		Object.values(CARE_TYPE_TO_TASKS).forEach((tasks) => {
			tasks.forEach((task) => {
				if (!allTasks.includes(task)) allTasks.push(task);
			});
		});
		return allTasks.length > 0 ? allTasks : [...helpOptions];
	}
	const availableTasks: string[] = [];
	selectedCareTypes.forEach((careType) => {
		const tasksForType = CARE_TYPE_TO_TASKS[careType] || [];
		tasksForType.forEach((task) => {
			if (!availableTasks.includes(task)) availableTasks.push(task);
		});
	});
	return availableTasks.length > 0 ? availableTasks : [...helpOptions];
}
