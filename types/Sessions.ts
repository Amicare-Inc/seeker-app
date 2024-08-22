export interface Session {
    id: string;
    requesterId: string;
    targetId: string;
    status: string;
    createdAt?: string;
    updatedAt?: string;
}