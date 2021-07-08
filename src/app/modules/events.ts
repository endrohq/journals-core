import { BaseModule } from 'lisk-sdk';

import { CreateEvent } from './assets/create_event';
import { findEvents, findEventById } from './actions/events';
import { PublishToEvent } from './assets/publish_to_event';

export class EventModule extends BaseModule {
	name = 'events';
	id = 1024;
	transactionAssets = [new CreateEvent(), new PublishToEvent()];
	actions = {
		find: async () => findEvents(this._dataAccess),
		getEvent: async ({ id }: Record<string, any>) => findEventById(id, this._dataAccess),
	};
}
