// SUBSCRIPTION ASSET

export const subscriptionSchema = {
	type: 'object',
	required: [],
	properties: {
		id: {
			dataType: 'string',
			fieldNumber: 1,
		},
		address: {
			dataType: 'bytes',
			fieldNumber: 2,
			minLength: 20,
			maxLength: 20,
		},
		expiresAt: {
			dataType: 'uint32',
			fieldNumber: 3,
		},
		startsAt: {
			dataType: 'uint32',
			fieldNumber: 4,
		},
	},
};

export const createSubscriptionSchema = {
	$id: 'journals/treasury/createSubscription',
	type: 'object',
	required: ['amount'],
	properties: {
		amount: {
			dataType: 'uint32',
			fieldNumber: 1,
		},
	},
};

export const subscriptionStateSchema = {
	$id: 'journals/subscriptions',
	type: 'object',
	required: ['subscriptions'],
	properties: {
		subscriptions: {
			type: 'array',
			fieldNumber: 1,
			items: subscriptionSchema,
		},
	},
};

// SUPPORT EVENT ASSET

export const supportEventSchema = {
	type: 'object',
	required: ['eventId', 'address'],
	properties: {
		eventId: {
			dataType: 'string',
			fieldNumber: 1,
		},
		address: {
			dataType: 'bytes',
			fieldNumber: 2,
			minLength: 20,
			maxLength: 20,
		},
		blockHeight: {
			dataType: 'uint32',
			fieldNumber: 3,
		},
	},
};

export const supportEventAssetSchema = {
	$id: 'journals/treasury/supportEvent',
	...supportEventSchema,
};

export const supportedEventStateSchema = {
	$id: 'journals/supportedEvents',
	type: 'object',
	required: ['supportedEvents'],
	properties: {
		supportedEvents: {
			type: 'array',
			fieldNumber: 1,
			items: supportEventSchema,
		},
	},
};
