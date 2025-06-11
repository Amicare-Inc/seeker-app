export interface ChecklistItem {
	id: string;
	task: string;
	checked: boolean;
	time: string;
	checkedBy?: string; // userId who checked the item
}

export interface SessionComment {
	text: string;
	time: string; // Just the time in HH:MM format
}

export interface Session {
	id: string;
	senderId: string; // The user who created the session (previously "requesterId")
	receiverId: string; // The user receiving the session (previously "targetUserId")
	participants: string[]; // [senderId, receiverId] → Allows querying both in one request
	status:
		| 'newRequest'
		| 'pending'
		| 'confirmed'
		| 'rejected'
		| 'declined'
		| 'cancelled'
		| 'inProgress'
		| 'completed'
		| 'failed'; // Updated status flow
	createdAt?: string;
	updatedAt?: string;
	startTime?: string; // ISO date format
	endTime?: string; // ISO date format
	note?: string;
	billingDetails?: {
		basePrice: number;
		taxes: number;
		serviceFee: number;
		total: number;
	};
	confirmedBy?: string[]; // Users who have confirmed the session
	// New fields for live session
	readyToStart?: {
		[userId: string]: {
			confirmed: boolean;
			confirmedAt: string; // ISO date string
		};
	};
	actualStartTime?: string | null; // ISO date string
	actualEndTime?: string | null; // ISO date string
	liveStatus?: 'upcoming' | 'ready' | 'started' | 'completed' | 'failed';
    liveStatusUpdatedAt?: string;
	checklist?: ChecklistItem[]; // Live checklist that both users can see and update
	comments?: SessionComment[]; // Array of simple comment objects
}
