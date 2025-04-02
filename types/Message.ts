export interface Message {
	id: string; // Unique document ID
	sessionId: string; // The session this message belongs to
	userId: string; // The user who sent the message
	message: string; // The message content
	timestamp: Date; // When the message was sent
}
