import { ApplyAssetContext, BaseAsset, codec } from 'lisk-sdk';
import {
	SUPPORT_EVENT_ASSET_ID,
	CHAIN_STATE_SUPPORTED_EVENTS,
	MAX_SUPPORTED_EVENTS_FOR_TREASURY_ROUND,
} from '../constants';
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
		const currentHeight = stateStore.chain.lastBlockHeaders[0].height;
		const { supportedEvents = [] } = await getChainStateByStateStore(
			stateStore,
			CHAIN_STATE_SUPPORTED_EVENTS,
			supportedEventStateSchema,
		);

		/*
			- GET current treasury round
			- Check if user already has x amount of 'eventSupport' for that current round
		* */

		if (supportedEvents?.length > 0) {
			const events = supportedEvents.filter(
				item => Buffer.compare(item.address, transaction.senderAddress) === 0,
			);
			if (events?.length >= MAX_SUPPORTED_EVENTS_FOR_TREASURY_ROUND) {
				throw new Error(
					`You already have a maximum of ${MAX_SUPPORTED_EVENTS_FOR_TREASURY_ROUND} events for this treasury round`,
				);
			}
		}

		const supportedEvent = {
			eventId: asset.eventId,
			address: transaction.senderAddress,
			height: currentHeight,
		};

		supportedEvents.push(supportedEvent);
		await stateStore.chain.set(
			CHAIN_STATE_SUPPORTED_EVENTS,
			codec.encode(supportedEventStateSchema, { supportedEvents }),
		);
	}
}
