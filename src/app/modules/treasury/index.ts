import { BaseModule } from 'lisk-sdk';

import { Subscribe } from './transactions/subscribe';
import { getTreasuryAsJson, getSubscriptionsAsJson } from './helpers';

export class TreasuryModule extends BaseModule {
	name = 'treasury';
	id = 1025;
	transactionAssets = [new Subscribe()];
	actions = {
		getSubscriptions: async ({ address }: Record<string, any>) =>
			getSubscriptionsAsJson(this._dataAccess, address),
		getTreasury: async () => getTreasuryAsJson(this._dataAccess),
	};
}
