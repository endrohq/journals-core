export interface Subscription {
	address: string;
	expiresAt: bigint;
	startsAt: bigint;
}

export interface SupportedEvent {
	eventId: string;
	address: string;
}

export interface NewsEvent {
	id: string;
	title: string;
	description: string;
	createdBy: string;
	supporters: number;
}
