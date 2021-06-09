import { Application, PartialApplicationConfig, utils } from 'lisk-sdk';
import { registerModules } from './modules';
import { registerPlugins } from './plugins';

export const getApplication = (
	genesisBlock: Record<string, unknown>,
	config: PartialApplicationConfig,
): Application => {

	const appConfig = utils.objects.mergeDeep({}, config, {
		network: {
			port: 8080
		},
		plugins: {
			httpApi: {
				port: 4000,
				whiteList: []
			}
		},
		rpc: {
			enable: true,
			port: 4001,
			mode: 'ws',
		}
	});

	const app = Application.defaultApplication(genesisBlock, appConfig);

	registerModules(app);
	registerPlugins(app);

	return app;
};
