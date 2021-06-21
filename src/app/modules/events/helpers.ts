import { codec } from 'lisk-sdk';
import { eventsSchema } from './schemas';
import { CHAIN_STATE_EVENTS } from './constants';

export const getAllEvents = async stateStore => {
	const registeredEventsBuffer = await stateStore.chain.get(CHAIN_STATE_EVENTS);
	if (!registeredEventsBuffer) {
		return [];
	}

	const decodedEvents = codec.decode(eventsSchema, registeredEventsBuffer);

	// @ts-ignore
	return decodedEvents.events;
};

export const getAllEventsAsJson = async dataAccess => {
	const registeredEventsBuffer = await dataAccess.getChainState(CHAIN_STATE_EVENTS);
	if (!registeredEventsBuffer) {
		return [];
	}

	const decodedEvents = codec.decode(eventsSchema, registeredEventsBuffer);

	// @ts-ignore
	return decodedEvents.events;
};

export const findOneAsJson = async (id: string, dataAccess) => {
	const registeredEventsBuffer = await dataAccess.getChainState(CHAIN_STATE_EVENTS);
	if (!registeredEventsBuffer) {
		return [];
	}

	const decodedEvents = codec.decode(eventsSchema, registeredEventsBuffer);

	// @ts-ignore
	return decodedEvents.events.find(item => item.id === id);
};
