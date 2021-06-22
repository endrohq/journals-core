export interface CreateSubscriptionAssetContext {
	id: string;
}

export interface PickEventAssetContext {
	eventId: string;
}

export interface Subscription {
	address: string;
	expiresAt: bigint;
	startsAt: bigint;
}
