import { BaseModuleDataAccess, StateStore } from 'lisk-framework/dist-node/types';
import { Schema } from 'lisk-commander/dist/types';
import { codec } from 'lisk-sdk';

export const getChainStateByDataAccess = async (
	dataAccess: BaseModuleDataAccess,
	CHAIN_STATE_TARGET: string,
	schema: Schema,
): Promise<Record<string, any>> => {
	const buffer = await dataAccess.getChainState(CHAIN_STATE_TARGET);
	if (!buffer) {
		return {};
	}
	return codec.decode(schema, buffer);
};

export const getChainStateByStateStore = async (
	stateStore: StateStore,
	CHAIN_STATE_TARGET: string,
	schema: Schema,
): Promise<Record<string, any>> => {
	const buffer = await stateStore.chain.get(CHAIN_STATE_TARGET);
	if (!buffer) {
		return {};
	}
	return codec.decode(schema, buffer);
};
