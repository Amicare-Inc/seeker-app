export interface Session {
    id: string;
    requesterId: string;
    targetUserId: string;
    status: string;
    // createdAt?: string;
    // updatedAt?: string;
    startDate?: string; // ISO date format
    endDate?: string; // ISO date format
    note?: string; // Details of the request (help type, etc.)
    billingDetails?: {
      basePrice: number;
      taxes: number;
      serviceFee: number;
      total: number;
    };
}