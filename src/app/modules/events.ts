import { BaseModule } from 'lisk-sdk';

import { CreateEvent } from './assets/create_event';
import { GenesisConfig } from 'lisk-framework/dist-node/types';
import { getActions } from './actions/events';

export class EventModule extends BaseModule {
	name = 'events';
	id = 1024;
	transactionAssets = [new CreateEvent()];

	constructor(genesisConfig: GenesisConfig) {
		super(genesisConfig);

		this.actions = getActions(this._dataAccess);
	}
}
