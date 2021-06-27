import { BaseModule } from 'lisk-sdk';

import { Subscribe } from './assets/subscribe';
import { getSubscriptions, hasSupportedEvent, getSnapshotByRound } from './actions/treasury';
import { SupportEvent } from './assets/support_event';

export class TreasuryModule extends BaseModule {
	name = 'treasury';
	id = 1025;
	transactionAssets = [new Subscribe(), new SupportEvent()];

	actions = {
		getSubscriptions: async ({ address }: Record<string, any>) =>
			getSubscriptions(this._dataAccess, address),
		hasSupportedEvent: async ({ address, eventId }: Record<string, any>) =>
			hasSupportedEvent(this._dataAccess, address, eventId),
		getSnapshotByRound: async () => getSnapshotByRound(this._dataAccess),
	};
}
