import { ApplyAssetContext, BaseAsset, codec } from 'lisk-sdk';
import { CHAIN_STATE_EVENTS, PUBLISH_TO_EVENT_ASSET_ID } from '../constants';
import { eventsSchema, publishToEventSchema } from '../schemas/events';
import { getChainStateByStateStore } from '../utils/chain.utils';
import { NewsEvent, NewsHistoryTypes, PublishToNewsEventAsset } from '../typings';

export class PublishToEvent extends BaseAsset {
	id = PUBLISH_TO_EVENT_ASSET_ID;
	name = 'publishToEvent';
	schema = publishToEventSchema;

	async apply({
		asset,
		stateStore,
		transaction,
	}: ApplyAssetContext<PublishToNewsEventAsset>): Promise<void> {
		const transactionHash = (transaction.id as Buffer).toString('hex');

		const { events = [] } = (await getChainStateByStateStore(
			stateStore,
			CHAIN_STATE_EVENTS,
			eventsSchema,
		)) as { events: NewsEvent[] };

		let event = events?.find(event => event.id === asset.eventId);
		if (!event) {
			throw new Error('Event does not exist');
		}

		const index = events.findIndex(event => event.id === asset.eventId);
		events[index] = {
			...event,
			dateUpdated: asset.dateCreated,
			activity: [
				{
					createdBy: transaction.senderAddress,
					type: NewsHistoryTypes.EVENT_UPDATED,
					transactionHash,
					transactionDate: asset.dateCreated,
					media: asset.media,
					location: asset.location,
					statement: asset.statement,
				},
				...event.activity,
			],
		};

		await stateStore.chain.set(CHAIN_STATE_EVENTS, codec.encode(eventsSchema, { events }));
	}
}
