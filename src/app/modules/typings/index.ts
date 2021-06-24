export interface Subscription {
	address: string;
	expiresAt: bigint;
	startsAt: bigint;
}

export interface SupportedEvent {
	eventId: string;
	address: string;
}
