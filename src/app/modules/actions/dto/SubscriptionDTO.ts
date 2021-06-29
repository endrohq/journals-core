import { Subscription } from '../../typings';

export class SubscriptionDTO implements Subscription {
	id: string;
	address: string;
	expiresAt: bigint;
	startsAt: bigint;

	constructor(id: string, item: Subscription) {
		this.id = id;
		this.address = item.address;
		this.expiresAt = item.expiresAt;
		this.startsAt = item.startsAt;
	}
}
