import { codec } from 'lisk-sdk';
import { subscriptionModuleSchema } from './schemas/subscription';
import { supportEventAssetSchema } from './schemas/support_event';
import {
	CHAIN_STATE_SUBSCRIPTIONS,
	CHAIN_STATE_TREASURY,
	CHAIN_STATE_SUPPORTED_EVENTS,
} from './constants';
import { Subscription } from './types';

export const getAllSubscriptions = async stateStore => {
	const registeredTreasuryBuffer = await stateStore.chain.get(CHAIN_STATE_SUBSCRIPTIONS);
	if (!registeredTreasuryBuffer) {
		return [];
	}
	const decodedSubscriptions = codec.decode(subscriptionModuleSchema, registeredTreasuryBuffer);

	// @ts-ignore
	return decodedSubscriptions.subscriptions;
};

export const getTreasuryAsJson = async dataAccess => {
	const registeredSubscriptionsBuffer = await dataAccess.getChainState(CHAIN_STATE_TREASURY);
	if (!registeredSubscriptionsBuffer) {
		return [];
	}

	const decodedSubscriptions = codec.decode(
		subscriptionModuleSchema,
		registeredSubscriptionsBuffer,
	);

	// @ts-ignore
	return decodedSubscriptions.subscriptions;
};

export const getSubscriptionsAsJson = async (dataAccess, address) => {
	const registeredSubscriptionsBuffer = await dataAccess.getChainState(CHAIN_STATE_SUBSCRIPTIONS);
	if (!registeredSubscriptionsBuffer) {
		return [];
	}
	const { subscriptions = [] } = codec.decode(
		subscriptionModuleSchema,
		registeredSubscriptionsBuffer,
	);
	return subscriptions.filter(
		(item: Subscription) => Buffer.from(item?.address).toString('hex') === address,
	);
};

export const setSubscriptions = async (stateStore, subscriptions) => {
	await stateStore.chain.set(
		CHAIN_STATE_SUBSCRIPTIONS,
		codec.encode(subscriptionModuleSchema, subscriptions),
	);
};

export const getAllPickedEvents = async stateStore => {
	const registeredPickedEventsBuffer = await stateStore.chain.get(CHAIN_STATE_SUPPORTED_EVENTS);
	if (!registeredPickedEventsBuffer) {
		return [];
	}

	const decodedEvents = codec.decode(supportEventAssetSchema, registeredPickedEventsBuffer);

	// @ts-ignore
	return decodedEvents.events;
};
