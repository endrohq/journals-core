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

export interface NewsEventAsset {
	title: string;
	dateCreated: bigint;
	media: NewsEventMedia[];
	location: NewsEventLocation;
	statement: NewsEventStatement;
}

export interface PublishToNewsEventAsset {
	eventId: string;
	createdBy: string;
	dateCreated: bigint;
	media: NewsEventMedia[];
	location: NewsEventLocation;
	statement: NewsEventStatement;
}

export interface NewsEvent {
	id: string;
	title: string;
	createdBy: Buffer;
	dateCreated: bigint;
	dateUpdated: bigint;
	activity: NewsEventActivity[];
}

export interface NewsEventDTO extends NewsEvent {
	supporters: number;
	labelStats: Record<string, number>;
}

export interface NewsEventActivity {
	createdBy: Buffer;
	transactionHash: string;
	transactionDate: bigint;
	type: NewsHistoryTypes;
	media: NewsEventMedia[];
	location: NewsEventLocation;
	statement: NewsEventStatement;
}

export enum NewsHistoryTypes {
	EVENT_CREATED = 'EVENT_CREATED',
	EVENT_UPDATED = 'EVENT_UPDATED',
}

export interface NewsEventMedia {
	mediaId: string;
	labels: string[];
}

export interface NewsEventLocation {
	longitude: number;
	latitude: number;
}

export interface NewsEventStatement {
	entities: Entity[];
	verbs: string[];
	text: string;
}

export interface Entity {
	entity: string;
	entityType: string;
}
