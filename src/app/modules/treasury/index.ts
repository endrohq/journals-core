import { BaseModule } from 'lisk-sdk';

import { Subscribe } from './transactions/create_subscription';
import { getTreasuryAsJson, getSubscriptionAsJson } from './helpers';

export class TreasuryModule extends BaseModule {
	name = 'treasury';
	id = 1025;
	transactionAssets = [new Subscribe()];
	actions = {
		getSubscription: async ({ address }: Record<string, any>) =>
			getSubscriptionAsJson(this._dataAccess, address),
		getTreasury: async () => getTreasuryAsJson(this._dataAccess),
	};
}
