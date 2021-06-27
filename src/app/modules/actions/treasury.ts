import { transactions } from 'lisk-sdk';
import { supportedEventStateSchema, subscriptionStateSchema } from '../schemas/treasury';
import {
	CHAIN_STATE_SUBSCRIPTIONS,
	CHAIN_STATE_SUPPORTED_EVENTS,
	TREASURY_ADDRESS,
	TREASURY_BLOCK_WINDOW_SIZE,
} from '../constants';
import { NewsEvent, Subscription, SupportedEvent } from '../typings';
import { getChainStateByDataAccess } from '../utils/chain.utils';
import { BaseModuleDataAccess } from 'lisk-framework/dist-node/types';
import { findEvents } from './events';
import * as R from 'remeda';

export const getSubscriptions = async (dataAccess: BaseModuleDataAccess, address: string) => {
	const { subscriptions = [] } = await getChainStateByDataAccess(
		dataAccess,
		CHAIN_STATE_SUBSCRIPTIONS,
		subscriptionStateSchema,
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

export const getSnapshotByRound = async (dataAccess: BaseModuleDataAccess) => {
	let account;
	let holdings = BigInt(0);

	try {
		account = await dataAccess.getAccountByAddress(Buffer.from(TREASURY_ADDRESS, 'hex'));
		if (account) {
			holdings = BigInt(account?.token?.balance);
		}
	} catch (e) {}

	const [{ supportedEvents = [] }, blockHeader] = await Promise.all([
		getChainStateByDataAccess(dataAccess, CHAIN_STATE_SUPPORTED_EVENTS, supportedEventStateSchema),
		dataAccess.getLastBlockHeader(),
	]);

	const eventIds = supportedEvents.map(item => item.eventId);
	const events = await findEvents(dataAccess);

	// { [eventId]: number }
	const eventSupportersMap = getEventSupportersMap(events, eventIds);

	// { [eventId]: BigInt }
	const funding = getQuadraticFunding(
		Number(transactions.convertBeddowsToLSK(`${account?.token?.balance || 0}`)),
		eventSupportersMap,
	);

	return {
		round: Math.floor(blockHeader.height / TREASURY_BLOCK_WINDOW_SIZE),
		holdings: holdings.toString(),
		events: events.map(event => ({
			...event,
			supporters: eventSupportersMap[event.id],
			funding: funding[event.id].toString(),
		})),
	};
};

const getEventSupportersCount = (eventId: string, eventIds: string[]): number =>
	R.countBy(eventIds, id => id === eventId);

const getEventSupportersMap = (events: NewsEvent[], eventIds: string[]): Record<string, number> =>
	R.flatMapToObj(events, event => [
		[String(event.id), getEventSupportersCount(event.id, eventIds)],
	]);

const getQuadraticFunding = (
	totalAmount: number,
	eventSupportCount: Record<string, number>,
): Record<string, number> => {
	let summed = 0; // Setup summed grant contributions
	let result = {};
	if (totalAmount === 0) {
		return R.mapValues(eventSupportCount, () => 0);
	}

	Object.keys(eventSupportCount).forEach(eventId => {
		console.log(eventSupportCount[eventId]);
		let sumAmount = Math.sqrt(eventSupportCount[eventId]);
		console.log(sumAmount);
		// Square the total value of each summed grants contributions
		sumAmount *= sumAmount;
		result[eventId] = sumAmount;
		summed += sumAmount;
	});
	console.log(result);
	// Setup a divisor based on available match
	let divisor = summed !== 0 ? totalAmount / summed : 0;

	console.log(divisor);
	// Multiply matched values with divisor to get match amount in range of available funds
	Object.keys(eventSupportCount).forEach(eventId => {
		result[eventId] *= divisor;
	});

	return result;
};
