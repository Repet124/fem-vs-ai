var brain = require('brain.js')
var fs = require('fs');
var Logger = require('../services/logger');
var InputBuilder = require('../dataset/rankOneInputBuilder');
var OutputBuilder = require('../dataset/rankOneOutputBuilder');
var { parseSchema } = require('../common');
var logger = new Logger('Train');

function train(datasetFile, modelFile, modelName) {
	const rawDataset = fs.readFileSync(datasetFile).toString();
	if (!rawDataset) {
		logger.err('Отсутствует датасет для обучений');
		return;
	}

	const dataset = rawDataset
		.split('\n')
		.map(schema => {
			schema = parseSchema(schema);
			return {
				input: new InputBuilder(schema).getDataset(),
				output: new OutputBuilder(schema).getDataset()
			}
		});


	const config = {
		// iterations: 10000,
		binaryThresh: 0.5,
		inputSize: dataset[0].input.length,
		outputSize: dataset[0].output.length,
		hiddenLayers: [
			Math.round(dataset[0].output.length*2),
		], // array of ints for the sizes of the hidden layers in the network
		activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
		leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
		log: true
	};

	// const net = new brain.NeuralNetwork(config);
	const net = new brain.NeuralNetworkGPU(config);

	logger.info('Старт обучения. ' + modelName);
	logger.bench('train');

	net.train(dataset);

	logger.success('Обучение завершено');
	logger.bench('train');

	logger.info('Сохранение модели');

	fs.writeFileSync(modelFile, JSON.stringify(net.toJSON()), 'utf8');

	logger.success('Модель сохранена ' + modelFile);
}

module.exports = train;