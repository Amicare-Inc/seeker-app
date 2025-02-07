export interface User {
    id: string;
    firstName: string;
    lastName: string;
    age: string;
    address: string;
    phone: string;
    email: string;
    isPsw: boolean;
    profilePhotoUrl?: string;
    rate?: number;
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
}