/**
 * Merge the date part from one Date with the time part from another.
 * Forces seconds and milliseconds to zero.
 */
export const mergeDateAndTime = (datePart: Date, timePart: Date): Date => {
	return new Date(
		datePart.getFullYear(),
		datePart.getMonth(),
		datePart.getDate(),
		timePart.getHours(),
		timePart.getMinutes(),
		0, // force seconds to 0
		0, // force milliseconds to 0
	);
};

/**
 * Round a date to the nearest 15 minutes.
 * Also resets seconds and milliseconds to zero.
 */
export const roundDateTo15Min = (date: Date): Date => {
	date.setSeconds(0, 0);
	const interval = 15 * 60 * 1000; // 15 minutes in ms
	return new Date(Math.round(date.getTime() / interval) * interval);
};

/**
 * Enforce that the given date is at least 2 hours in the future.
 * If not, returns a new date set to now + 2 hours.
 */
export const enforceTwoHourBuffer = (date: Date): Date => {
	const now = new Date();
	const minTime = new Date(now.getTime() + 2 * 60 * 60 * 1000);
	return date < minTime ? minTime : date;
};

/**
 * Format Date from ISO string
 */
export const formatDate = (dateStr: string) => {
	const date = new Date(dateStr);
	return isNaN(date.getTime())
		? 'Invalid Date'
		: date.toLocaleDateString('en-US', {
				weekday: 'short',
				day: '2-digit',
				month: 'short',
			});
};

/**
 * Format Time from ISO string
 */
export const formatTimeRange = (start: string, end: string) => {
	const s = new Date(start);
	const e = new Date(end);
	if (isNaN(s.getTime()) || isNaN(e.getTime())) return 'Invalid Time';
	const startStr = s.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
	});
	const endStr = e.toLocaleTimeString([], {
		hour: '2-digit',
		minute: '2-digit',
	});
	return `${startStr} - ${endStr}`;
};

/**
 * Get time until start in a human-readable format
 */
export const getTimeUntilStart = (startTime: string): string => {
	const start = new Date(startTime);
	const now = new Date();
	const diffMs = start.getTime() - now.getTime();
	const diffMins = Math.round(diffMs / 60000);

	if (diffMins < 60) {
		return `${diffMins} min`;
	} else {
		const hours = Math.floor(diffMins / 60);
		const mins = diffMins % 60;
		return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
	}
};

/**
 * Format duration in milliseconds to HH:MM:SS
 */
export const formatDuration = (ms: number): string => {
	const seconds = Math.floor((ms / 1000) % 60);
	const minutes = Math.floor((ms / (1000 * 60)) % 60);
	const hours = Math.floor(ms / (1000 * 60 * 60));

	const pad = (n: number) => n.toString().padStart(2, '0');
	return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};
