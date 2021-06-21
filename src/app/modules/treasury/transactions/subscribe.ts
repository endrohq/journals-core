import { ApplyAssetContext, BaseAsset, codec } from 'lisk-sdk';
import {
	CHAIN_STATE_SUBSCRIPTIONS,
	SUBSCRIBE_ASSET_ID,
	SUBSCRIPTION_PERIOD_IN_BLOCKS,
	SUBSCRIPTION_FEE,
	TREASURY_ADDRESS,
} from '../constants';
import { subscribeSchema, subscriptionModuleSchema } from '../schemas';
import { CreateSubscriptionAssetContext } from '../types';
import { getAllSubscriptions } from '../helpers';

export class Subscribe extends BaseAsset {
	id = SUBSCRIBE_ASSET_ID;
	name = 'subscribe';
	schema = subscribeSchema;

	async apply({
		transaction,
		stateStore,
		reducerHandler,
		asset,
	}: ApplyAssetContext<CreateSubscriptionAssetContext>): Promise<void> {
		const sender = await stateStore.account.get(transaction.senderAddress);
		const currentHeight = stateStore.chain.lastBlockHeaders[0].height;
		const subscription = {
			id: asset.id,
			address: sender.address,
			startsAt: currentHeight,
			expiresAt: currentHeight + SUBSCRIPTION_PERIOD_IN_BLOCKS,
		};

		const subscriptions = await getAllSubscriptions(stateStore);
		subscriptions.push(subscription);
		await stateStore.chain.set(
			CHAIN_STATE_SUBSCRIPTIONS,
			codec.encode(subscriptionModuleSchema, { subscriptions }),
		);

		const accountBalance = await reducerHandler.invoke<bigint>('token:getBalance', {
			address: sender.address,
		});

		const minRemainingBalance = await reducerHandler.invoke<bigint>('token:getMinRemainingBalance');

		const subtractableBalance =
			accountBalance - minRemainingBalance > BigInt(0)
				? accountBalance - minRemainingBalance
				: BigInt(0);

		if (subtractableBalance > BigInt(0)) {
			await reducerHandler.invoke('token:debit', {
				address: transaction.senderAddress,
				amount: SUBSCRIPTION_FEE,
			});
			await reducerHandler.invoke('token:credit', {
				address: Buffer.from(TREASURY_ADDRESS, 'hex'),
				amount: SUBSCRIPTION_FEE,
			});
		}
	}
}
