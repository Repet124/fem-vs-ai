var brain = require('brain.js')
var fs = require('fs');
var Logger = require('../services/logger');
var logger = new Logger('Train');

function train(datasetFile, modelFile, modelName) {
	const jsonDataset = fs.readFileSync(datasetFile)
	if (!jsonDataset) {
		logger.err('Отсутствует датасет для обучений');
		return;
	}
	const dataset = JSON.parse(jsonDataset);
	const config = {
		// iterations: 10000,
		binaryThresh: 0.5,
		hiddenLayers: [
			Math.round(dataset[0].output.length*2),
		], // array of ints for the sizes of the hidden layers in the network
		activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
		leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
		log: true
	};

	const net = new brain.NeuralNetwork(config);
	// const net = new brain.NeuralNetworkGPU(config);

	logger.info('Старт обучения. ' + modelName);
	logger.bench('train');

	net.train(dataset);

	logger.success('Обучение завершено');
	logger.bench('train');

	logger.info('Сохранение модели');

	fs.writeFileSync(modelFile, 'module.exports = ' + net.toFunction().toString(), 'utf8');
	// fs.writeFileSync(modelFile, JSON.stringify(net.toJSON()), 'utf8');

	logger.success('Модель сохранена ' + modelFile);
}

module.exports = train;