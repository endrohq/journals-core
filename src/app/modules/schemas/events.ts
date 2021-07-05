export const eventSchema = {
	type: 'object',
	required: ['title', 'longitude', 'latitude', 'createdBy'],
	properties: {
		id: {
			dataType: 'string',
			fieldNumber: 1,
		},
		title: {
			dataType: 'string',
			fieldNumber: 2,
		},
		longitude: {
			fieldNumber: 3,
			dataType: 'string',
		},
		latitude: {
			fieldNumber: 4,
			dataType: 'string',
		},
		createdBy: {
			dataType: 'bytes',
			fieldNumber: 5,
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
