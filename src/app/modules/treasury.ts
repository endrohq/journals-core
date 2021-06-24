import { BaseModule } from 'lisk-sdk';

import { Subscribe } from './assets/subscribe';
import { getActions } from './actions/treasury';
import { SupportEvent } from './assets/support_event';
import { GenesisConfig } from 'lisk-framework/dist-node/types';

export class TreasuryModule extends BaseModule {
	name = 'treasury';
	id = 1025;
	transactionAssets = [new Subscribe(), new SupportEvent()];

	constructor(genesisConfig: GenesisConfig) {
		super(genesisConfig);

		this.actions = getActions(this._dataAccess);
	}
}
