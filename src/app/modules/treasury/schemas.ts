export const CHAIN_STATE_HELLO_COUNTER = 'hello:helloCounter';

export const eventSchema = {
	type: 'object',
	required: ['title', 'description', 'createdBy'],
	properties: {
		id: {
			dataType: 'string',
			fieldNumber: 1,
		},
		title: {
			dataType: 'string',
			fieldNumber: 2,
		},
		description: {
			dataType: 'string',
			fieldNumber: 3,
		},
		createdBy: {
			dataType: 'string',
			fieldNumber: 4,
		},
	},
};

export const treasurySchema = {
	$id: 'journals/events',
	type: 'object',
	required: ['events'],
	properties: {
		events: {
			type: 'array',
			fieldNumber: 1,
			items: eventSchema,
		},
	},
};

export const subscribeSchema = {
	$id: 'journals/events/create',
	...eventSchema,
};
