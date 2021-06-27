import { BaseModule } from 'lisk-sdk';

import { CreateEvent } from './assets/create_event';
import { findEvents, findEventById } from './actions/events';

export class EventModule extends BaseModule {
	name = 'events';
	id = 1024;
	transactionAssets = [new CreateEvent()];
	actions = {
		find: async () => findEvents(this._dataAccess),
		getEvent: async ({ id }: Record<string, any>) => findEventById(id, this._dataAccess),
	};
}
