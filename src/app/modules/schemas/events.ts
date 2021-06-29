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
			dataType: 'bytes',
			fieldNumber: 4,
			minLength: 20,
			maxLength: 20,
		},
	},
};

export const eventsSchema = {
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

export const createEventSchema = {
	$id: 'journals/events/create',
	...eventSchema,
};
