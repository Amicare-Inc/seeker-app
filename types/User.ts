export interface User {
	id: string;
	firstName: string;
	lastName: string;
	dob?: string; // Date of Birth ISO string MM/DD/YYYY
	age?: string;
	gender?: string;
	address: string;
	phone: string;
	email: string;
	isPsw: boolean;
	profilePhotoUrl?: string;
	rate?: number;
	idVerified?: boolean;
	emailVerified?: boolean;
	phoneVerified?: boolean;
	hasProfilePhoto?: boolean;
	carePreferences?: {
		lookingForSelf?: boolean;
		careType?: string[];
		tasks?: string[];
		availability?: {
			[days: string]: { start: string; end: string }[]; // Example: { "Monday": [{ start: "09:00", end: "17:00" }, { start: "19:00", end: "21:00" }]
		};
	};
	onboardingComplete: boolean;
	bio?: string;
}
