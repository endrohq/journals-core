export interface CreateSubscriptionAssetContext {
	id: string;
}

export interface TokenAccount {
	token: {
		balance: bigint;
	};
}

export interface Subscription {
	address: string;
	expiresAt: bigint;
	startsAt: bigint;
}
