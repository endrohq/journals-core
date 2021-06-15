export const CHAIN_STATE_HELLO_COUNTER = "hello:helloCounter";

export const eventSchema = {
    type: "object",
    required: ["id", "name", "description", "createdBy"],
    properties: {
        id: {
            dataType: "string",
            fieldNumber: 1,
        },
        name: {
            dataType: "string",
            fieldNumber: 2,
        },
        description: {
            dataType: "string",
            fieldNumber: 3,
        },
        createdBy: {
            dataType: "string",
            fieldNumber: 4,
        }
    }
}


export const eventsSchema = {
    $id: "journals/events",
    type: "object",
    required: ["events"],
    properties: {
        events: {
            type: "array",
            fieldNumber: 1,
            items: eventSchema
        },
    },
};

export const createEventSchema = {
    $id: "lisk/hello/counter",
    type: "object",
    required: ["helloCounter"],
    properties: {
        helloCounter: {
            dataType: "uint32",
            fieldNumber: 1,
        },
    },
};
