import { ApplyAssetContext, BaseAsset } from 'lisk-sdk';
import { SUBSCRIBE_ASSET_ID, SUBSCRIPTION_PERIOD_IN_BLOCKS } from '../constants';
import { subscribeSchema } from '../schemas';
import { CreateSubscriptionAssetContext } from '../types';
import { getAllSubscriptions, setSubscriptions } from '../helpers';
import { generateUUID } from '../../../utils/uuid.utils';

export class Subscribe extends BaseAsset {
	id = SUBSCRIBE_ASSET_ID;
	name = 'subscribe';
	schema = subscribeSchema;

	async apply({
		transaction,
		stateStore,
	}: ApplyAssetContext<CreateSubscriptionAssetContext>): Promise<void> {
		const sender = await stateStore.account.get(transaction.senderAddress);
		const currentHeight = stateStore.chain.lastBlockHeaders[0].height + 1;
		const subscription = {
			id: generateUUID(),
			address: sender.address,
			startsAt: currentHeight,
			expiresAt: currentHeight + SUBSCRIPTION_PERIOD_IN_BLOCKS,
		};

		const subscriptions = await getAllSubscriptions(stateStore);
		subscriptions.push(subscription);
		await setSubscriptions(stateStore, subscriptions);
		/*
                const accountBalance = await reducerHandler.invoke<bigint>('token:getBalance', {
                    address: sender.address,
                });

                const minRemainingBalance = await reducerHandler.invoke<bigint>('token:getMinRemainingBalance');

                const subtractableBalance =
                    accountBalance - minRemainingBalance > BigInt(0)
                        ? accountBalance - minRemainingBalance
                        : BigInt(0);

                if (subtractableBalance > BigInt(0)) {
                    await reducerHandler.invoke('token:credit', {
                        address: transaction.senderAddress,
                        amount: reward,
                    });
                }*/
	}
}
