import { ApplyAssetContext, BaseAsset, codec } from 'lisk-sdk';
import { CHAIN_STATE_EVENTS, CREATE_EVENT_ASSET_ID } from '../constants';
import { createEventSchema, eventsSchema } from '../schemas';
import { getAllEvents } from '../helpers';
import { CreateEventAssetContext } from '../types';

export class CreateEventAsset extends BaseAsset {
	id = CREATE_EVENT_ASSET_ID;
	name = 'createEvent';
	schema = createEventSchema;

	async apply({ asset, stateStore }: ApplyAssetContext<CreateEventAssetContext>): Promise<void> {
		const event = {
			id: asset.id,
			title: asset.title,
			description: asset.description,
			createdBy: asset.createdBy,
		};

		const events = await getAllEvents(stateStore);
		events.push(event);
		await stateStore.chain.set(CHAIN_STATE_EVENTS, codec.encode(eventsSchema, { events }));
	}
}
