export interface SessionDTO {
  senderId: string;
  receiverId: string;
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
}