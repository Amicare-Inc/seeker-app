export interface SessionDTO {
  senderId: string;
  receiverId?: string;
  startTime?: string;
  endTime?: string;
  note?: string;
  billingDetails?: {
    basePrice: number;
    taxes: number;
    serviceFee: number;
    total: number;
  };
  checklist?: {
    id: string;
    task: string;
    completed: boolean;
  }[];
  // New fields for family member support
  careRecipientId?: string; // ID of who receives care (senderId if lookingForSelf=true, familyMember.id if false)
  careRecipientType?: 'self' | 'family'; // Indicates if care is for self or family member
  // Distance info from PSW user card (embedded when seeker creates session)
  distanceInfo?: {
    distance: string; // e.g., "5.2 km away"
    duration: string; // e.g., "12 min drive"
    distanceValue: number; // raw distance in meters for sorting
  };
}