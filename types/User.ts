export interface User {
    id: string;
    firstName: string;
    lastName: string;
    dob: string; // Date of Birth ISO string
    age: string;
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
        bio?: string;
        availability?: {
            [days: string]: { start: string; end: string}[];
        };
    };
    onboardingComplete: boolean;
    bio?: string;
}