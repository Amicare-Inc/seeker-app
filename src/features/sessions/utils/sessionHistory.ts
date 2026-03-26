import { EnrichedSession } from '@/types/EnrichedSession';

/**
 * Sessions that belong in "history": anything past the initial request/interest
 * phase — upcoming booked sessions (confirmed), in progress, completed, etc.
 * Excludes only `newRequest` and `interested` (not yet booked).
 */
export function filterHistorySessions(sessions: EnrichedSession[]): EnrichedSession[] {
	const notYetBooked = new Set(['newRequest', 'interested']);
	return sessions.filter(
		(session) => session.status && !notYetBooked.has(session.status),
	);
}

export function sortSessionsNewestFirst(
	sessions: EnrichedSession[],
): EnrichedSession[] {
	return [...sessions].sort((a, b) => {
		const ta = new Date(
			a.actualEndTime ||
				a.endTime ||
				a.startTime ||
				a.updatedAt ||
				a.createdAt ||
				0,
		).getTime();
		const tb = new Date(
			b.actualEndTime ||
				b.endTime ||
				b.startTime ||
				b.updatedAt ||
				b.createdAt ||
				0,
		).getTime();
		return tb - ta;
	});
}

export function formatHistoryDateTime(iso: string | undefined): {
	date: string;
	time: string;
} {
	if (!iso) {
		return { date: '—', time: '' };
	}
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) {
		return { date: '—', time: '' };
	}
	return {
		date: d.toLocaleDateString(undefined, {
			month: 'short',
			day: 'numeric',
			year: 'numeric',
		}),
		time: d.toLocaleTimeString(undefined, {
			hour: 'numeric',
			minute: '2-digit',
		}),
	};
}

export function formatHistoryPrice(session: EnrichedSession): string {
	const total = session.billingDetails?.total;
	if (typeof total === 'number' && !Number.isNaN(total)) {
		return `$${total.toFixed(2)}`;
	}
	return '—';
}

export function historyDisplayName(session: EnrichedSession): string {
	const u = session.otherUser;
	if (u?.firstName || u?.lastName) {
		return [u.firstName, u.lastName].filter(Boolean).join(' ').trim() || 'Session';
	}
	return 'Session';
}
