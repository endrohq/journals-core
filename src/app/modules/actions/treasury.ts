import { supportedEventStateSchema } from '../schemas/treasury';
import { CHAIN_STATE_SUBSCRIPTIONS, CHAIN_STATE_SUPPORTED_EVENTS } from '../constants';
import { Subscription, SupportedEvent } from '../typings';
import { getChainStateByDataAccess } from '../utils/chain.utils';
import { BaseModuleDataAccess } from 'lisk-framework/dist-node/types';
import { findEventsByIds } from './events';

export const getSubscriptions = async (dataAccess: BaseModuleDataAccess, address: string) => {
	const { subscriptions = [] } = await getChainStateByDataAccess(
		dataAccess,
		CHAIN_STATE_SUBSCRIPTIONS,
		supportedEventStateSchema,
	);
	return subscriptions.filter(
		(item: Subscription) => Buffer.from(item?.address).toString('hex') === address,
	);
};

export const hasSupportedEvent = async (
	dataAccess: BaseModuleDataAccess,
	address: string,
	eventId: string,
) => {
	const { supportedEvents = [] } = await getChainStateByDataAccess(
		dataAccess,
		CHAIN_STATE_SUPPORTED_EVENTS,
		supportedEventStateSchema,
	);
	if (supportedEvents?.length === 0) return false;

	const support = supportedEvents.find(
		(item: SupportedEvent) =>
			Buffer.from(item?.address).toString('hex') === address && eventId == item.eventId,
	);
	return !!support;
};

export const getEventsForCurrentRound = async (dataAccess: BaseModuleDataAccess) => {
	const [{ supportedEvents = [] }, blockHeader] = await Promise.all([
		getChainStateByDataAccess(dataAccess, CHAIN_STATE_SUPPORTED_EVENTS, supportedEventStateSchema),
		dataAccess.getLastBlockHeader(),
	]);
	console.log(blockHeader.height);
	const eventIds = supportedEvents.map(item => item.eventId);
	return findEventsByIds(dataAccess, eventIds);
};
