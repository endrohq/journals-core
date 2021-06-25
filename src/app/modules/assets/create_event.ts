import { ApplyAssetContext, BaseAsset, codec } from 'lisk-sdk';
import { CHAIN_STATE_EVENTS, CREATE_EVENT_ASSET_ID } from '../constants';
import { createEventSchema, eventsSchema } from '../schemas/events';
import { getChainStateByStateStore } from '../utils/chain.utils';
import { NewsEvent } from '../typings';

export class CreateEvent extends BaseAsset {
	id = CREATE_EVENT_ASSET_ID;
	name = 'createEvent';
	schema = createEventSchema;

	async apply({ asset, stateStore }: ApplyAssetContext<NewsEvent>): Promise<void> {
		const event = {
			id: asset.id,
			title: asset.title,
			description: asset.description,
			createdBy: asset.createdBy,
		};

		const { events = [] } = await getChainStateByStateStore(
			stateStore,
			CHAIN_STATE_EVENTS,
			eventsSchema,
		);
		events.push(event);
		await stateStore.chain.set(CHAIN_STATE_EVENTS, codec.encode(eventsSchema, { events }));
	}
}
