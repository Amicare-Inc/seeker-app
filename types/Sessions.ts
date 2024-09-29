export interface Session {
    id: string;
    requesterId: string;
    targetUserId: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}