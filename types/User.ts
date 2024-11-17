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
    carePreferences?: {
        lookingForSelf?: boolean;
        careType?: string[];
        tasks?: string[];
        availability?: {
            days: string[];
            times: string[];
        };
    };
}