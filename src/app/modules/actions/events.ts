import { eventsSchema } from '../schemas/events';
import { CHAIN_STATE_EVENTS } from '../constants';
import { NewsEvent } from '../typings';
import { BaseModuleDataAccess } from 'lisk-framework/dist-node/types';
import { getChainStateByDataAccess } from '../utils/chain.utils';

export const findEvents = async (dataAccess: BaseModuleDataAccess): Promise<NewsEvent[]> => {
	const { events = [] } = await getChainStateByDataAccess(
		dataAccess,
		CHAIN_STATE_EVENTS,
		eventsSchema,
	);
	return events;
};

export const findEventsByIds = async (dataAccess: BaseModuleDataAccess, eventIds: string[]) => {
	const events = await findEvents(dataAccess);
	return eventIds?.map(id => events.find(item => item.id === id));
};

export const findEventById = async (id: string, dataAccess: BaseModuleDataAccess) => {
	const { events = [] } = await getChainStateByDataAccess(
		dataAccess,
		CHAIN_STATE_EVENTS,
		eventsSchema,
	);
	// @ts-ignore
	return events.find(item => item.id === id);
};
