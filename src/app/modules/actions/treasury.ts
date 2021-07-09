import { transactions } from 'lisk-sdk';
import { supportedEventStateSchema, subscriptionStateSchema } from '../schemas/treasury';
import {
	CHAIN_STATE_SUBSCRIPTIONS,
	CHAIN_STATE_SUPPORTED_EVENTS,
	SUBSCRIPTION_FEE,
	SUBSCRIPTION_PERIOD_IN_BLOCKS,
	TREASURY_ADDRESS,
} from '../constants';
import { NewsEvent, Subscription, SupportedEvent } from '../typings';
import { getChainStateByDataAccess } from '../utils/chain.utils';
import { BaseModuleDataAccess } from 'lisk-framework/dist-node/types';
import { findEvents } from './events';
import * as R from 'remeda';
import { SubscriptionDTO } from './dto/SubscriptionDTO';

export const getSubscriptions = async (dataAccess: BaseModuleDataAccess, address: string) => {
	const { subscriptions = [] } = await getChainStateByDataAccess(
		dataAccess,
		CHAIN_STATE_SUBSCRIPTIONS,
		subscriptionStateSchema,
	);
	return subscriptions
		.filter((item: Subscription) => Buffer.from(item?.address).toString('hex') === address)
		.map(item => new SubscriptionDTO(item.id, item));
};

export const hasActiveSubscription = async (dataAccess: BaseModuleDataAccess, address: string) => {
	const [{ subscriptions = [] }, { height }] = await Promise.all([
		getChainStateByDataAccess(dataAccess, CHAIN_STATE_SUBSCRIPTIONS, subscriptionStateSchema),
		dataAccess.getLastBlockHeader(),
	]);
	const activeSubscription = subscriptions.find(
		(item: Subscription) =>
			Buffer.from(item?.address).toString('hex') === address && item.expiresAt > height,
	);
	return !!activeSubscription;
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

export const getSupportedEventsForRound = async (
	dataAccess: BaseModuleDataAccess,
	round: number,
): Promise<SupportedEvent[]> => {
	const { supportedEvents = [] } = await getChainStateByDataAccess(
		dataAccess,
		CHAIN_STATE_SUPPORTED_EVENTS,
		supportedEventStateSchema,
	);

	const startsAt = (round - 1) * SUBSCRIPTION_PERIOD_IN_BLOCKS + 1;
	const endsAt = round * SUBSCRIPTION_PERIOD_IN_BLOCKS;
	return supportedEvents.filter(
		(event: SupportedEvent) => event.blockHeight >= startsAt && event.blockHeight <= endsAt,
	);
};

export const getSupportedEventsByAddress = async (
	dataAccess: BaseModuleDataAccess,
	address: string,
): Promise<SupportedEvent[]> => {
	const response = await getChainStateByDataAccess(
		dataAccess,
		CHAIN_STATE_SUPPORTED_EVENTS,
		supportedEventStateSchema,
	);
	const supportedEvents = (response.supportedEvents || []) as SupportedEvent[];
	const addressBuffer = Buffer.from(address, 'hex');
	return supportedEvents.filter(item => Buffer.compare(item.address, addressBuffer) === 0);
};

export const getTreasuryContext = async (dataAccess: BaseModuleDataAccess) => {
	let account;
	let holdings = BigInt(0);

	const [blockHeader, { subscriptions = [] }] = await Promise.all([
		dataAccess.getLastBlockHeader(),
		getChainStateByDataAccess(dataAccess, CHAIN_STATE_SUBSCRIPTIONS, subscriptionStateSchema),
	]);

	const currentRound = Math.floor(blockHeader.height / SUBSCRIPTION_PERIOD_IN_BLOCKS) + 1;

	try {
		account = await dataAccess.getAccountByAddress(Buffer.from(TREASURY_ADDRESS, 'hex'));
		if (account) {
			holdings = BigInt(account?.token?.balance);
		}
	} catch (e) {}

	const { funding: currentRoundFunds } = getFundingAmountForRound(currentRound, subscriptions);

	const supportedEvents = await getSupportedEventsForRound(dataAccess, currentRound);
	const eventIds = supportedEvents.map(item => item.eventId);
	const events = await findEvents(dataAccess);

	// { [eventId]: number }
	const eventSupportersMap = getEventSupportersMap(events, eventIds);

	// { [eventId]: BigInt }
	const funding = getQuadraticFunding(
		Number(transactions.convertBeddowsToLSK(`${currentRoundFunds || 0}`)),
		eventSupportersMap,
	);

	return {
		events,
		eventSupportersMap,
		supportedEvents,
		holdings,
		funding,
	};
};

export const getSnapshotByRound = async (dataAccess: BaseModuleDataAccess) => {
	const [blockHeader, { subscriptions = [] }] = await Promise.all([
		dataAccess.getLastBlockHeader(),
		getChainStateByDataAccess(dataAccess, CHAIN_STATE_SUBSCRIPTIONS, subscriptionStateSchema),
	]);

	const currentRound = Math.floor(blockHeader.height / SUBSCRIPTION_PERIOD_IN_BLOCKS) + 1;

	const {
		events,
		eventSupportersMap,
		funding,
		holdings,
		supportedEvents,
	} = await getTreasuryContext(dataAccess);

	const rounds: any[] = [];

	for (let i = 1; i <= 4; i++) {
		const startsAt = (i - 1) * SUBSCRIPTION_PERIOD_IN_BLOCKS + 1;
		const endsAt = i * SUBSCRIPTION_PERIOD_IN_BLOCKS;

		const { contributors } = getFundingAmountForRound(i, subscriptions);
		rounds.push({
			startsAt,
			endsAt,
			contributors,
		});
	}

	// const { funding: currentRoundFunds } = getFundingAmountForRound(currentRound, subscriptions);

	return {
		currentRound,
		rounds,
		treasuryFunds: holdings.toString(),
		subscriptionCount: supportedEvents?.length || 0,
		events: events.map(event => ({
			...event,
			treasury: {
				supporters: eventSupportersMap[event.id],
				funding: funding[event.id].toString(),
			},
		})),
	};
};

const getEventSupportersCount = (eventId: string, eventIds: string[]): number =>
	R.countBy(eventIds, id => id === eventId);

const getEventSupportersMap = (events: NewsEvent[], eventIds: string[]): Record<string, number> =>
	R.flatMapToObj(events, event => [
		[String(event.id), getEventSupportersCount(event.id, eventIds)],
	]);

export const getTreasuryContextForEvent = async (
	dataAccess: BaseModuleDataAccess,
	eventId: string,
) => {
	const { eventSupportersMap, funding } = await getTreasuryContext(dataAccess);

	return {
		funding: funding[eventId],
		supporters: eventSupportersMap[eventId],
	};
};

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
		const arr = Array(eventSupportCount[eventId]).fill(Math.sqrt(1));
		let sumAmount = arr.reduce((a, b) => a + b, 0);
		// Square the total value of each summed grants contributions
		sumAmount *= sumAmount;
		result[eventId] = sumAmount;
		summed += sumAmount;
	});
	// Setup a divisor based on available match
	let divisor = summed !== 0 ? totalAmount / summed : 0;
	// Multiply matched values with divisor to get match amount in range of available funds
	Object.keys(eventSupportCount).forEach(eventId => {
		result[eventId] *= divisor;
	});

	return result;
};

const getFundingAmountForRound = (round: number, subscriptions: Subscription[]) => {
	const filtered = subscriptions.filter((item: Subscription) => {
		const lastSubscriptionRound = Math.round(
			Number(item.expiresAt) / SUBSCRIPTION_PERIOD_IN_BLOCKS,
		);
		return lastSubscriptionRound > round - 1;
	});
	const contributors = filtered?.length || 0;
	return {
		funding: contributors * SUBSCRIPTION_FEE,
		contributors,
	};
};
