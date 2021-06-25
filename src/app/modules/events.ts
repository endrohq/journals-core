import { BaseModule } from 'lisk-sdk';

import { CreateEvent } from './assets/create_event';
import { find, findOne } from './actions/events';

export class EventModule extends BaseModule {
	name = 'events';
	id = 1024;
	transactionAssets = [new CreateEvent()];
	actions = {
		find: async () => find(this._dataAccess),
		getEvent: async ({ id }: Record<string, any>) => findOne(id, this._dataAccess),
	};
}
