import { supportedEventStateSchema } from '../schemas/treasury';
import { CHAIN_STATE_SUBSCRIPTIONS, CHAIN_STATE_SUPPORTED_EVENTS } from '../constants';
import { Subscription, SupportedEvent } from '../typings';
import { getChainStateByDataAccess } from '../utils/chain.utils';
import { BaseModuleDataAccess } from 'lisk-framework/dist-node/types';

const getSubscriptions = async (dataAccess, address) => {
	const { subscriptions = [] } = await getChainStateByDataAccess(
		dataAccess,
		CHAIN_STATE_SUBSCRIPTIONS,
		supportedEventStateSchema,
	);
	return subscriptions.filter(
		(item: Subscription) => Buffer.from(item?.address).toString('hex') === address,
	);
};

const hasSupportedEvent = async (dataAccess, address, eventId) => {
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

const getEventsForCurrentRound = async dataAccess => {
	const { supportedEvents = [] } = await getChainStateByDataAccess(
		dataAccess,
		CHAIN_STATE_SUPPORTED_EVENTS,
		supportedEventStateSchema,
	);
	return supportedEvents;
};

export const getActions = (dataAccess: BaseModuleDataAccess) => ({
	getSubscriptions: async ({ address }: Record<string, any>) =>
		getSubscriptions(dataAccess, address),
	hasSupportedEvent: async ({ address, eventId }: Record<string, any>) =>
		hasSupportedEvent(dataAccess, address, eventId),
	getEventsForCurrentRound: async () => getEventsForCurrentRound(dataAccess),
});
