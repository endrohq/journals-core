import { Application } from 'lisk-sdk';
import { EventModule } from './modules/events'

export const registerModules = (app: Application): void => {
    app.registerModule(EventModule);
};
