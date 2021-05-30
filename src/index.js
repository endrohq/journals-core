const dotenv = require('dotenv');
dotenv.config();

const {
	Application,
	utils,
	configDevnet,
	genesisBlockDevnet
} = require('lisk-sdk');


const appConfig = utils.objects.mergeDeep({}, configDevnet, {
	label: 'journals',
	genesisConfig: {
		communityIdentifier: 'LSK'
	},
	rpc: {
		enable: true,
		port: 4001,
		mode: 'ws',
	}
});

const app = Application.defaultApplication(genesisBlockDevnet, appConfig);

app
	.run()
	.then(() => app.logger.info('Arcado node has started'))
	.catch(error => {
		console.error('Faced error in application', error);
		process.exit(0);
	});
