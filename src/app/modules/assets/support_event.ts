import { ApplyAssetContext, BaseAsset, codec } from 'lisk-sdk';
import { SUPPORT_EVENT_ASSET_ID, CHAIN_STATE_SUPPORTED_EVENTS } from '../constants';
import { supportedEventStateSchema, supportEventAssetSchema } from '../schemas/treasury';
import { getChainStateByStateStore } from '../utils/chain.utils';

interface SupportedEventAssetContext {
	eventId: string;
	address: string;
}

export class SupportEvent extends BaseAsset {
	id = SUPPORT_EVENT_ASSET_ID;
	name = 'supportEvent';
	schema = supportEventAssetSchema;

	async apply({
		stateStore,
		asset,
		transaction,
	}: ApplyAssetContext<SupportedEventAssetContext>): Promise<void> {
		const supportedEvent = {
			eventId: asset.eventId,
			address: transaction.senderAddress,
		};

		const { supportedEvents = [] } = await getChainStateByStateStore(
			stateStore,
			CHAIN_STATE_SUPPORTED_EVENTS,
			supportedEventStateSchema,
		);
		supportedEvents.push(supportedEvent);
		await stateStore.chain.set(
			CHAIN_STATE_SUPPORTED_EVENTS,
			codec.encode(supportedEventStateSchema, { supportedEvents }),
		);
	}
}
