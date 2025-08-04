export interface User {
	id?: string;
	firstName: string;
	lastName: string;
	dob: string; // Date of Birth ISO string MM/DD/YYYY
	gender?: string;
	address: {
		fullAddress: string;
		street: string;
		city: string;
		province: string;
		country: string;
		postalCode: string;
	}
	phone: string;
	email: string;
	isPsw: boolean;
	profilePhotoUrl?: string;
	rate?: number;
	idVerified?: boolean;
	emailVerified?: boolean;
	phoneVerified?: boolean;
	hasProfilePhoto?: boolean;
	// Indicates if NON-PSW user is seeking care for themselves (true) or family members (false)
	// PSWs should have this as undefined since they provide care, not seek it
	lookingForSelf?: boolean;
	// For PSWs (services they provide) & self-care seekers (care they need)
	carePreferences?: {
		careType?: string[];
		tasks?: string[];
		availability?: {
			[days: string]: { start: string; end: string }[];
		};
	};
	onboardingComplete: boolean;
	bio?: string;
	stripeAccountId?: string;
	// New fields for pricing algorithm and user management
	rating?: number; // 1-5 star rating
	idManualVerified?: boolean; // Manual verification status
	isActive?: boolean; // User account active status
	isShowing?: boolean; // Whether user appears in search results
	totalCareHours?: number; // Total hours of care provided/received
	totalSessions?: number; // Total number of completed sessions
	// For family-care seekers (each family member's care needs)
	familyMembers?: Array<{
		id: string;
		firstName: string;
		lastName: string;
		relationshipToUser: string;
		address: {
			fullAddress: string;
			street: string;
			city: string;
			province: string;
			country: string;
			postalCode: string;
		};
		profilePhotoUrl?: string;
		bio?: string;
		rating?: number; // Rating for this family member's care experiences
		// Each family member has their own care preferences
		carePreferences: {
			careType: string[];
			tasks: string[];
			availability: {
				[days: string]: { start: string; end: string }[];
			};
		};
	}>;
	// Distance information (added dynamically by backend)
	distanceInfo?: {
		distance: string;
		duration: string;
		distanceValue: number;
	};
	// Family member card marker (added by frontend transformation)
	isFamilyMemberCard?: boolean;
	familyMemberInfo?: {
		id: string;
		firstName: string;
		lastName: string;
		profilePhotoUrl?: string;
		address: {
			fullAddress: string;
			street: string;
			city: string;
			province: string;
			country: string;
			postalCode: string;
		};
		carePreferences: {
			careType: string[];
			tasks: string[];
			availability: {
				[days: string]: { start: string; end: string }[];
			};
		};
	};
}

// Utility functions for consistent user type checking
export const getUserType = (user: User | null | undefined): 'PSW' | 'SELF_CARE_SEEKER' | 'FAMILY_CARE_SEEKER' | 'UNKNOWN' => {
	if (!user) return 'UNKNOWN';
	if (user.isPsw) return 'PSW';
	if (user.lookingForSelf === true) return 'SELF_CARE_SEEKER';
	if (user.lookingForSelf === false) return 'FAMILY_CARE_SEEKER';
	return 'UNKNOWN';
};

export const isPswUser = (user: User | null | undefined): boolean => {
	return user?.isPsw === true;
};

export const isSelfCareSeeker = (user: User | null | undefined): boolean => {
	return !user?.isPsw && user?.lookingForSelf === true;
};

export const isFamilyCareSeeker = (user: User | null | undefined): boolean => {
	return !user?.isPsw && user?.lookingForSelf === false;
};

export const isCareSeekerUser = (user: User | null | undefined): boolean => {
	return !user?.isPsw && user?.lookingForSelf !== undefined;
};
