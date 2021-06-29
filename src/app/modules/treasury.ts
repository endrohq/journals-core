import { BaseModule } from 'lisk-sdk';

import { Create_subscription } from './assets/create_subscription';
import {
	getSubscriptions,
	hasSupportedEvent,
	getSnapshotByRound,
	hasActiveSubscription,
	getSupportedEventsByAddress,
} from './actions/treasury';
import { SupportEvent } from './assets/support_event';

export class TreasuryModule extends BaseModule {
	name = 'treasury';
	id = 1025;
	transactionAssets = [new Create_subscription(), new SupportEvent()];

	actions = {
		getSubscriptions: async ({ address }: Record<string, any>) =>
			getSubscriptions(this._dataAccess, address),
		hasActiveSubscription: async ({ address }: Record<string, any>) =>
			hasActiveSubscription(this._dataAccess, address),
		getSupportedEvents: async ({ address }: Record<string, any>) =>
			getSupportedEventsByAddress(this._dataAccess, address),
		hasSupportedEvent: async ({ address, eventId }: Record<string, any>) =>
			hasSupportedEvent(this._dataAccess, address, eventId),
		getSnapshotByRound: async () => getSnapshotByRound(this._dataAccess),
	};
}
