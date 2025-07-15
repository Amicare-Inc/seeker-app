import { Session } from './Sessions';
import { User } from './User';

export interface CareRecipientData {
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
}

export interface EnrichedSession extends Session {
	// 'otherUser' holds the full user data for whoever is "not the current user" (ALWAYS the account holder)
	otherUser?: User;
	// 'careRecipient' holds the data for who receives care (family member or account holder)
	careRecipient?: CareRecipientData;
	// 'isForFamilyMember' indicates if care is for family member
	isForFamilyMember?: boolean;
}
