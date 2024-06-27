var brain = require('../services/brain.js')
var fs = require('fs');
var Logger = require('../services/logger');
var DatasetBuilder = require('../dataset/datasetBuilder');
var { parseSchema } = require('../services/func');
var logger = new Logger('Train');
var datasetBuilder = new DatasetBuilder();

function train(schema, rawDataset, modelName, batchSize, agesCount, datasetSize) {

	var dataset = datasetBuilder.parse(rawDataset, schema, datasetSize);

	const config = {
		iterations: 5,
		errorThresh: 0.003,
		binaryThresh: 0.001,
		learningRate: 0.01,
		inputSize: dataset[0].input.length,
		outputSize: dataset[0].output.length,
		hiddenLayers: [
			Math.round(dataset[0].output.length)*2,
			Math.round(dataset[0].output.length*1.2),
			// Math.round(datasets[0][0].input.length),
		], // array of ints for the sizes of the hidden layers in the network
		activation: 'sigmoid', // supported activation types: ['sigmoid', 'relu', 'leaky-relu', 'tanh'],
		leakyReluAlpha: 0.01, // supported for activation type 'leaky-relu'
		log: true,
		logPeriod: 5
	};

	// const net = new brain.NeuralNetwork(config);
	const net = new brain.NeuralNetworkGPU(config);

	logger.info('Старт обучения. ' + modelName);
	logger.bench('train');

	for (var i = 0; i < agesCount; i++) {
		logger.info('Размер пакета: ' + batchSize);
		logger.info('Число пакетов: ' + (dataset.length / batchSize));
		logger.info('Число эпох: ' + agesCount);
		logger.info('Текущая эпоха: ' + (i+1));

		getAge(dataset, batchSize).forEach((batch,i) => net.train(batch));
	}

	logger.success('Обучение завершено');
	logger.bench('train');

	return JSON.stringify(net.toJSON())
}


function getAge(dataset, batchSize) {
	shuffle(dataset);
	return Array(dataset.length / batchSize).fill().map((_,i) => dataset.slice(i*batchSize, i*batchSize+batchSize-1))
}

function shuffle(array) {
	Array(array.length).fill().forEach((_,i,arr) => {
		let index = arr.length - 1 - i;
		if (index < 0 || index >= arr.length) {console.log(index)}
		let j = Math.floor(Math.random() * (index));
		[array[index], array[j]] = [array[j], array[index]];
	});
}

module.exports = train;
