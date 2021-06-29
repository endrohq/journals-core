// EVENTS
export const CREATE_EVENT_ASSET_ID = 0;
export const CHAIN_STATE_EVENTS = 'journals:events';

// SUBSCRIBE
export const SUBSCRIBE_ASSET_ID = 0;
export const SUBSCRIPTION_PERIOD_IN_BLOCKS = 250;
export const SUBSCRIPTION_FEE = BigInt(1000000000);
export const TREASURY_ADDRESS = 'a3b9b616f53864c20aca720bcbefec3586339c1d';

export const CHAIN_STATE_TREASURY = 'journals:treasury';
export const CHAIN_STATE_SUBSCRIPTIONS = 'journals:subscriptions';

// SUPPORT_EVENT

export const SUPPORT_EVENT_ASSET_ID = 1;
export const CHAIN_STATE_SUPPORTED_EVENTS = 'journals:supportedEvents';
export const MAX_SUPPORTED_EVENTS_FOR_TREASURY_ROUND = 2;

// TREASURY

export const TREASURY_BLOCK_WINDOW_SIZE = 100;
