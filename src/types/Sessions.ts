export interface ChecklistItem {
	id: string;
	task: string;
	completed: boolean;
	checked: boolean;
	time: string;
}

export interface SessionComment {
	id: string;
	userId: string;
	text: string;
	timestamp: string;
}

export interface SessionDistanceInfo {
	distance: string; // e.g., "5.2 km"
	duration: string; // e.g., "12 min drive"
	distanceValue: number; // raw distance in meters for sorting
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
	readyToEnd?: {
		[userId: string]: {
			confirmed: boolean;
			confirmedAt: string; // ISO date string
		};
	};
	actualStartTime?: string | null; // ISO date string
	actualEndTime?: string | null; // ISO date string
	liveStatus?: 'upcoming' | 'ready' | 'started' | 'ending' | 'completed' | 'failed';
    liveStatusUpdatedAt?: string;
	checklist?: ChecklistItem[]; // Live checklist that both users can see and update
	comments?: SessionComment[]; // Array of simple comment objects
	// New fields for family member support
	careRecipientId?: string; // ID of who receives care (senderId if lookingForSelf=true, familyMember.id if false)
	careRecipientType?: 'self' | 'family'; // Indicates if care is for self or family member
	careRecipientData?: {
		firstName: string;
		lastName: string;
		address: {
			fullAddress: string;
			street: string;
			city: string;
			province: string;
			country: string;
			postalCode: string;
		};
		profilePhotoUrl?: string;
		relationshipToUser?: string; // "Mother", "Father", etc.
	};
	// Distance information (calculated from PSW to care location)
	distanceInfo?: SessionDistanceInfo;
}
