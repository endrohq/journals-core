import { BaseModule } from 'lisk-sdk';

import { Subscribe } from './transactions/subscribe';
import { getTreasuryAsJson, getSubscriptionsAsJson } from './helpers';
import { Support_event } from './transactions/support_event';

export class TreasuryModule extends BaseModule {
	name = 'treasury';
	id = 1025;
	transactionAssets = [new Subscribe(), new Support_event()];
	actions = {
		getSubscriptions: async ({ address }: Record<string, any>) =>
			getSubscriptionsAsJson(this._dataAccess, address),
		getTreasury: async () => getTreasuryAsJson(this._dataAccess),
	};
}
