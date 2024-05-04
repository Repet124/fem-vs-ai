var brain = require('brain.js')
var fs = require('fs');
var Logger = require('../services/logger');
var InputBuilder = require('../dataset/rankOneInputBuilder');
var OutputBuilder = require('../dataset/rankOneOutputBuilder');
var { parseSchema } = require('../common');
var logger = new Logger('Train');

function train(datasetFile, modelFile, modelName) {
	var rawDataset = fs.readFileSync(datasetFile).toString();
	if (!rawDataset) {
		logger.err('Отсутствует датасет для обучений');
		return;
	}

	rawDataset = rawDataset
		.split('\n')
		.map(schema => {
			schema = parseSchema(schema);
			return {
				input: new InputBuilder(schema).getDataset(),
				output: new OutputBuilder(schema).getDataset()
			}
		});

	var datasets = new Array(rawDataset.length/100).fill().map((_,i) => rawDataset.slice(i*100, i*100+100));

	const config = {
		// iterations: 10000,
		errorThresh: 0.001,
		binaryThresh: 0.001,
		learningRate: 0.01,
		inputSize: datasets[0][0].input.length,
		outputSize: datasets[0][0].output.length,
		hiddenLayers: [
			Math.round(datasets[0][0].output.length*2),
			Math.round(datasets[0][0].output.length*1.2),
		], // array of ints for the sizes of the hidden layers in the network
		activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
		leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
		log: true
	};

	// const net = new brain.NeuralNetwork(config);
	const net = new brain.NeuralNetworkGPU(config);

	logger.info('Старт обучения. ' + modelName);
	logger.bench('train');

	for (var i = 0; i < datasets.length; i++) {
		logger.info('Эпоха ' + (i+1));
		net.train(datasets[i]);
	}

	logger.success('Обучение завершено');
	logger.bench('train');

	logger.info('Сохранение модели');

	fs.writeFileSync(modelFile, JSON.stringify(net.toJSON()), 'utf8');

	logger.success('Модель сохранена ' + modelFile);
}

module.exports = train;