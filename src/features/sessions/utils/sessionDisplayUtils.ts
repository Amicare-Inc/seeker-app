import { EnrichedSession } from '@/types/EnrichedSession';
import { User } from '@/types/User';

export interface SessionDisplayInfo {
	primaryName: string;
	primaryPhoto?: string;
	subtitle: string;
	location: string;
	contactInfo?: string;
}

export const getSessionDisplayInfo = (
	session: EnrichedSession, 
	currentUser: User
): SessionDisplayInfo => {
	
	
	 {
		// Seeker sees PSW info
		const psw = session.otherUser;
		const careRecipient = session.careRecipient;
		
		return {
			primaryName: `${psw?.firstName || ''} ${psw?.lastName || ''}`,
			primaryPhoto: psw?.profilePhotoUrl,
			subtitle: psw?.address?.city || 'Toronto, ON',
			location: psw?.address?.fullAddress || 'No address available',
			contactInfo: session.isForFamilyMember && careRecipient
				? `Care for: ${careRecipient.firstName} ${careRecipient.lastName}`
				: undefined
		};
	}
};

export const getCareRecipientName = (session: EnrichedSession): string => {
	if (session.careRecipient) {
		return `${session.careRecipient.firstName} ${session.careRecipient.lastName}`;
	}
	return session.otherUser ? `${session.otherUser.firstName} ${session.otherUser.lastName}` : 'Unknown';
};

export const getAccountHolderName = (session: EnrichedSession): string => {
	return session.otherUser ? `${session.otherUser.firstName} ${session.otherUser.lastName}` : 'Unknown';
}; 