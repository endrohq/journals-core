import { eventsSchema } from '../schemas/events';
import { CHAIN_STATE_EVENTS } from '../constants';
import { BaseModuleDataAccess } from 'lisk-framework/dist-node/types';
import { getChainStateByDataAccess } from '../utils/chain.utils';

export const find = async (dataAccess: BaseModuleDataAccess) => {
	const { events = [] } = await getChainStateByDataAccess(
		dataAccess,
		CHAIN_STATE_EVENTS,
		eventsSchema,
	);
	return events;
};

const findOne = async (id: string, dataAccess: BaseModuleDataAccess) => {
	const { events = [] } = await getChainStateByDataAccess(
		dataAccess,
		CHAIN_STATE_EVENTS,
		eventsSchema,
	);
	// @ts-ignore
	return events.find(item => item.id === id);
};

export const getActions = (dataAccess: BaseModuleDataAccess) => ({
	find: async () => find(dataAccess),
	findOne: async ({ id }: Record<string, any>) => findOne(id, dataAccess),
});
