export interface CreateSubscriptionAssetContext {}

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
