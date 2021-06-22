import { ApplyAssetContext, BaseAsset, codec } from 'lisk-sdk';
import { SUPPORT_EVENT_ASSET_ID, CHAIN_STATE_SUPPORTED_EVENTS } from '../constants';
import { supportEventAssetSchema } from '../schemas/support_event';
import { PickEventAssetContext } from '../types';
import { getAllEvents } from '../../events/helpers';

export class Support_event extends BaseAsset {
	id = SUPPORT_EVENT_ASSET_ID;
	name = 'supportEvent';
	schema = supportEventAssetSchema;

	async apply({ stateStore, asset }: ApplyAssetContext<PickEventAssetContext>): Promise<void> {
		const pickedEvent = {
			eventId: asset.eventId,
		};

		const pickedEvents = await getAllEvents(stateStore);
		pickedEvents.push(pickedEvent);
		await stateStore.chain.set(
			CHAIN_STATE_SUPPORTED_EVENTS,
			codec.encode(supportEventAssetSchema, { pickedEvents }),
		);
	}
}
