import { eventsSchema } from '../schemas/events';
import { CHAIN_STATE_EVENTS } from '../constants';
import { NewsEventDTO } from '../typings';
import { BaseModuleDataAccess } from 'lisk-framework/dist-node/types';
import { getChainStateByDataAccess } from '../utils/chain.utils';
import { getSupportersCountByEventId } from './treasury';
import * as R from 'remeda';

export const findEvents = async (dataAccess: BaseModuleDataAccess): Promise<NewsEventDTO[]> => {
	const { events = [] } = await getChainStateByDataAccess(
		dataAccess,
		CHAIN_STATE_EVENTS,
		eventsSchema,
	);
	return events as NewsEventDTO[];
};

export const findEventsByIds = async (dataAccess: BaseModuleDataAccess, eventIds: string[]) => {
	const events = await findEvents(dataAccess);
	return eventIds?.map(id => events.find(item => item.id === id));
};

export const findEventById = async (id: string, dataAccess: BaseModuleDataAccess) => {
	const [events, supporters] = await Promise.all([
		findEvents(dataAccess),
		getSupportersCountByEventId(dataAccess, id),
	]);

	const event = events.find(item => item.id === id);
	if (!event) return undefined;
	event.supporters = supporters;
	const labels =
		event?.activity.map(activity => activity?.media?.map(media => media?.labels)).flat(2) || [];
	event.labelStats = R.flatMapToObj(labels, label => [
		[label, R.countBy(labels, x => x === label)],
	]);
	return event;
};
