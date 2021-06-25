import { BaseModule } from 'lisk-sdk';

import { Subscribe } from './assets/subscribe';
import { getEventsForCurrentRound, getSubscriptions, hasSupportedEvent } from './actions/treasury';
import { SupportEvent } from './assets/support_event';
import { GenesisConfig } from 'lisk-framework/dist-node/types';

export class TreasuryModule extends BaseModule {
	name = 'treasury';
	id = 1025;
	transactionAssets = [new Subscribe(), new SupportEvent()];

	constructor(genesisConfig: GenesisConfig) {
		super(genesisConfig);

		this.actions = {
			getSubscriptions: async ({ address }: Record<string, any>) =>
				getSubscriptions(this._dataAccess, address),
			hasSupportedEvent: async ({ address, eventId }: Record<string, any>) =>
				hasSupportedEvent(this._dataAccess, address, eventId),
			getEventsForCurrentRound: async () => getEventsForCurrentRound(this._dataAccess),
		};
	}
}
