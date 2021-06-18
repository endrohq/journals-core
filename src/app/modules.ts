import { Application } from 'lisk-sdk';
import { EventModule } from './modules/events';
import { TreasuryModule } from './modules/treasury';

export const registerModules = (app: Application): void => {
	app.registerModule(EventModule);
	app.registerModule(TreasuryModule);
};
