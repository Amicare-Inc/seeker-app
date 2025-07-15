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
	const isPSW = currentUser.isPsw;
	
	if (isPSW) {
		// PSW sees care recipient info prominently
		const careRecipient = session.careRecipient;
		const accountHolder = session.otherUser;
		
		if (careRecipient) {
			return {
				primaryName: `${careRecipient.firstName} ${careRecipient.lastName}`,
				primaryPhoto: careRecipient.profilePhotoUrl,
				subtitle: session.isForFamilyMember && accountHolder
					? `Contact: ${accountHolder.firstName}` 
					: accountHolder?.address?.city || 'Toronto, ON',
				location: careRecipient.address?.fullAddress || 'No address available',
				contactInfo: session.isForFamilyMember && accountHolder
					? `${accountHolder.firstName} ${accountHolder.lastName}`
					: undefined
			};
		}
		
		// Fallback to account holder if no care recipient data
		return {
			primaryName: `${accountHolder?.firstName || ''} ${accountHolder?.lastName || ''}`,
			primaryPhoto: accountHolder?.profilePhotoUrl,
			subtitle: accountHolder?.address?.city || 'Toronto, ON',
			location: accountHolder?.address?.fullAddress || 'No address available'
		};
	} else {
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