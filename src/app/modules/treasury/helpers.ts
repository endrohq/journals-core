import { codec } from 'lisk-sdk';
import { treasurySchema } from './schemas';
import { CHAIN_STATE_SUBSCRIPTIONS, CHAIN_STATE_TREASURY } from './constants';
import { Subscription } from './types';

export const getAllSubscriptions = async stateStore => {
	const registeredTreasuryBuffer = await stateStore.chain.get(CHAIN_STATE_SUBSCRIPTIONS);
	if (!registeredTreasuryBuffer) {
		return [];
	}

	const decodedSubscriptions = codec.decode(treasurySchema, registeredTreasuryBuffer);

	// @ts-ignore
	return decodedSubscriptions.treasury;
};

export const getTreasuryAsJson = async dataAccess => {
	const registeredSubscriptionsBuffer = await dataAccess.getChainState(CHAIN_STATE_TREASURY);
	if (!registeredSubscriptionsBuffer) {
		return [];
	}

	const decodedSubscriptions = codec.decode(treasurySchema, registeredSubscriptionsBuffer);

	// @ts-ignore
	return decodedSubscriptions.subscriptions;
};

export const getSubscriptionAsJson = async (dataAccess, address) => {
	const registeredSubscriptionsBuffer = await dataAccess.getChainState(CHAIN_STATE_SUBSCRIPTIONS);
	if (!registeredSubscriptionsBuffer) {
		return [];
	}

	const { subscriptions = [] } = codec.decode(treasurySchema, registeredSubscriptionsBuffer);
	return subscriptions.find((item: Subscription) => item.address === address);
};

export const setSubscriptions = async (stateStore, subscriptions) => {
	const sortedSubscriptions = {
		subscriptions: subscriptions.sort((a, b) => a.id.compare(b.id)),
	};

	await stateStore.chain.set(
		CHAIN_STATE_SUBSCRIPTIONS,
		codec.encode(treasurySchema, sortedSubscriptions),
	);
};
