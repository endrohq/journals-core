import { ApplyAssetContext, BaseAsset, codec } from 'lisk-sdk';
import { CHAIN_STATE_EVENTS, CREATE_EVENT_ASSET_ID } from '../constants';
import { createEventSchema, eventsSchema } from '../schemas/events';
import { getChainStateByStateStore } from '../utils/chain.utils';
import { NewsEvent } from '../typings';

export class CreateEvent extends BaseAsset {
	id = CREATE_EVENT_ASSET_ID;
	name = 'createEvent';
	schema = createEventSchema;

	async apply({ asset, stateStore, transaction }: ApplyAssetContext<NewsEvent>): Promise<void> {
		const event = {
			id: (transaction.id as Buffer).toString('hex'),
			title: asset.title,
			longitude: asset.longitude,
			latitude: asset.latitude,
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
