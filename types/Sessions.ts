export interface Session {
  id: string;
  senderId: string;   // The user who created the session (previously "requesterId")
  receiverId: string; // The user receiving the session (previously "targetUserId")
  participants: string[]; // [senderId, receiverId] → Allows querying both in one request
  status: "newRequest" | "pending" | "confirmed" | "rejected" | "declined" | "cancelled"; // Updated status flow
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
}