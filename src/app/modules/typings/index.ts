export interface Subscription {
	address: string;
	expiresAt: bigint;
	startsAt: bigint;
}

export interface SupportedEvent {
	eventId: string;
	height: number;
	address: Buffer;
}

export interface NewsEvent {
	id: string;
	title: string;
	description: string;
	createdBy: string;
	supporters: number;
	longitude: number;
	latitude: number;
}

export interface Location {
	longitude: number;
	latitude: number;
}
