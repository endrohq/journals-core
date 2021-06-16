import { BaseModule }  from "lisk-sdk"

import { CreateEventAsset }  from "./transactions/create_event"
import {getAllEventsAsJson} from "./helpers";

export class EventModule extends BaseModule {
    name = "event";
    id = 1024;
    accountSchema = {
        type: "object",
        required: ["events"],
        properties: {
            events: {
                type: "array",
                fieldNumber: 1,
                items: {
                    dataType: "bytes",
                },
            },
        },
        default: {
            events: [],
        },
    };
    transactionAssets = [new CreateEventAsset()];
    actions = {
        getAll: async () => getAllEventsAsJson(this._dataAccess),
    }
}
