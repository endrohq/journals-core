export const supportEventSchema = {
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

export const supportEventAssetSchema = {
	$id: 'journals/treasury/supportEvent',
	...supportEventSchema,
};
