import { ApplyAssetContext, BaseAsset, codec } from 'lisk-sdk';
import { CHAIN_STATE_EVENTS, CREATE_EVENT_ASSET_ID } from '../constants';
import { createEventSchema, eventsSchema } from '../schemas/events';
import { getChainStateByStateStore } from '../utils/chain.utils';
import { NewsEvent, NewsEventAsset, NewsHistoryTypes } from '../typings';

export class CreateEvent extends BaseAsset {
	id = CREATE_EVENT_ASSET_ID;
	name = 'createEvent';
	schema = createEventSchema;

	async apply({
		asset,
		stateStore,
		transaction,
	}: ApplyAssetContext<NewsEventAsset>): Promise<void> {
		const transactionHash = (transaction.id as Buffer).toString('hex');
		const { events = [] } = (await getChainStateByStateStore(
			stateStore,
			CHAIN_STATE_EVENTS,
			eventsSchema,
		)) as { events: NewsEvent[] };

		const event: NewsEvent = {
			id: transactionHash,
			title: asset.title,
			createdBy: transaction.senderAddress,
			dateCreated: asset.dateCreated,
			dateUpdated: asset.dateCreated,
			activity: [
				{
					createdBy: transaction.senderAddress,
					type: NewsHistoryTypes.EVENT_CREATED,
					transactionHash: transactionHash,
					transactionDate: asset.dateCreated,
					media: asset.media,
					location: asset.location,
					statement: asset.statement,
				},
			],
		};
		events.push(event);

		await stateStore.chain.set(CHAIN_STATE_EVENTS, codec.encode(eventsSchema, { events }));
	}
}
