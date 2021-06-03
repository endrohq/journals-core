const dotenv = require('dotenv');
dotenv.config();

const {
	Application,
	utils,
	configDevnet,
	genesisBlockDevnet,
	HTTPAPIPlugin
} = require('lisk-sdk');


const appConfig = utils.objects.mergeDeep({}, configDevnet, {
	label: 'journals',
	genesisConfig: {
		communityIdentifier: 'LSK'
	},
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

const app = Application.defaultApplication(genesisBlockDevnet, appConfig);

app.registerPlugin(HTTPAPIPlugin);

app
	.run()
	.then(() => app.logger.info('Journals node has started'))
	.catch(error => {
		console.error('Faced error in application', error);
		process.exit(0);
	});
