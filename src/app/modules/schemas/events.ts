export const eventSchema = {
	type: 'object',
	required: ['title', 'activity', 'createdBy'],
	properties: {
		id: {
			dataType: 'string',
			fieldNumber: 1,
		},
		title: {
			dataType: 'string',
			fieldNumber: 2,
		},
		createdBy: {
			dataType: 'bytes',
			fieldNumber: 3,
			minLength: 20,
			maxLength: 20,
		},
		dateCreated: {
			dataType: 'uint32',
			fieldNumber: 4,
		},
		dateUpdated: {
			dataType: 'uint32',
			fieldNumber: 5,
		},
		activity: {
			type: 'array',
			fieldNumber: 6,
			items: {
				type: 'object',
				properties: {
					createdBy: {
						dataType: 'bytes',
						fieldNumber: 1,
						minLength: 20,
						maxLength: 20,
					},
					type: {
						dataType: 'string',
						fieldNumber: 2,
					},
					transactionHash: {
						dataType: 'string',
						fieldNumber: 3,
					},
					transactionDate: {
						dataType: 'uint32',
						fieldNumber: 4,
					},
					media: {
						type: 'array',
						fieldNumber: 5,
						items: {
							type: 'object',
							required: ['mediaId'],
							properties: {
								mediaId: {
									fieldNumber: 1,
									dataType: 'string',
								},
								labels: {
									type: 'array',
									fieldNumber: 2,
									items: {
										dataType: 'string',
									},
								},
							},
						},
					},
					location: {
						type: 'object',
						fieldNumber: 6,
						properties: {
							longitude: {
								fieldNumber: 1,
								dataType: 'string',
							},
							latitude: {
								fieldNumber: 2,
								dataType: 'string',
							},
						},
					},
					statement: {
						type: 'object',
						fieldNumber: 7,
						properties: {
							text: {
								dataType: 'string',
								fieldNumber: 1,
							},
							entities: {
								type: 'array',
								fieldNumber: 2,
								items: {
									type: 'object',
									properties: {
										entity: {
											fieldNumber: 1,
											dataType: 'string',
										},
										entityType: {
											fieldNumber: 2,
											dataType: 'string',
										},
									},
								},
							},
							verbs: {
								type: 'array',
								fieldNumber: 3,
								items: {
									dataType: 'string',
								},
							},
						},
					},
				},
			},
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
	type: 'object',
	required: ['title', 'media', 'dateCreated'],
	properties: {
		title: {
			dataType: 'string',
			fieldNumber: 1,
		},
		media: {
			type: 'array',
			fieldNumber: 2,
			items: {
				type: 'object',
				required: ['mediaId'],
				properties: {
					mediaId: {
						fieldNumber: 1,
						dataType: 'string',
					},
					labels: {
						type: 'array',
						fieldNumber: 2,
						items: {
							dataType: 'string',
						},
					},
				},
			},
		},
		location: {
			type: 'object',
			fieldNumber: 3,
			required: ['longitude', 'latitude'],
			properties: {
				longitude: {
					fieldNumber: 1,
					dataType: 'string',
				},
				latitude: {
					fieldNumber: 2,
					dataType: 'string',
				},
			},
		},
		dateCreated: {
			dataType: 'uint32',
			fieldNumber: 4,
		},
		statement: {
			type: 'object',
			fieldNumber: 5,
			properties: {
				text: {
					dataType: 'string',
					fieldNumber: 1,
				},
				entities: {
					type: 'array',
					fieldNumber: 2,
					items: {
						type: 'object',
						properties: {
							entity: {
								fieldNumber: 1,
								dataType: 'string',
							},
							entityType: {
								fieldNumber: 2,
								dataType: 'string',
							},
						},
					},
				},
				verbs: {
					type: 'array',
					fieldNumber: 3,
					items: {
						dataType: 'string',
					},
				},
			},
		},
	},
};

export const publishToEventSchema = {
	$id: 'journals/events/publishTo',
	type: 'object',
	required: ['eventId', 'media'],
	properties: {
		eventId: {
			dataType: 'string',
			fieldNumber: 1,
		},
		media: {
			type: 'array',
			fieldNumber: 2,
			items: {
				type: 'object',
				required: ['mediaId'],
				properties: {
					mediaId: {
						fieldNumber: 1,
						dataType: 'string',
					},
					labels: {
						type: 'array',
						fieldNumber: 2,
						items: {
							dataType: 'string',
						},
					},
				},
			},
		},
		location: {
			type: 'object',
			fieldNumber: 3,
			properties: {
				longitude: {
					fieldNumber: 1,
					dataType: 'string',
				},
				latitude: {
					fieldNumber: 2,
					dataType: 'string',
				},
			},
		},
		statement: {
			type: 'object',
			fieldNumber: 4,
			properties: {
				text: {
					dataType: 'string',
					fieldNumber: 1,
				},
				entities: {
					type: 'array',
					fieldNumber: 2,
					items: {
						type: 'object',
						properties: {
							entity: {
								fieldNumber: 1,
								dataType: 'string',
							},
							entityType: {
								fieldNumber: 2,
								dataType: 'string',
							},
						},
					},
				},
				verbs: {
					type: 'array',
					fieldNumber: 3,
					items: {
						dataType: 'string',
					},
				},
			},
		},
		dateCreated: {
			dataType: 'uint32',
			fieldNumber: 5,
		},
	},
};
