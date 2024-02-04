var brain = require('brain.js')
var fs = require('fs');
var Logger = require('../services/logger');
var logger = new Logger('Train');

module.exports.trainTranslations = train.bind(
	undefined,
	'./translations-dataset.json',
	'./translations-trained.js',
	'Модель расчёта перемещений'
);

module.exports.trainTensors = train.bind(
	undefined,
	'./tensors-dataset.json',
	'./tensors-trained.js',
	'Модель расчёт усилий'
);

function train(datasetFile, modelFile, modelName) {
	const jsonDataset = fs.readFileSync(datasetFile)
	if (!jsonDataset) {
		logger.err('Отсутствует датасет для обучений');
		return;
	}
	const dataset = JSON.parse(jsonDataset);
	const net = new brain.recurrent.LSTMTimeStep({
		inputSize: dataset[0].input[0].length,
		hiddenLayers: [10],
		outputSize: dataset[0].output.length,
		log: true,
		logPeriod: 10
	});
	logger.info('Старт обучения. ' + modelName);
	logger.bench('train');

	net.train(dataset.map(obj => [...obj.input, obj.output]));

	logger.success('Обучение завершено');
	logger.bench('train');

	logger.info('Сохранение модели');

	fs.writeFileSync(modelFile, net.toFunction().toString(), 'utf8');

	logger.success('Модель сохранена ' + modelFile);
}

