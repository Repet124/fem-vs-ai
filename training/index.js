var { parentPort, workerData } = require('worker_threads');
var path = require('path');
var train = require('./trainer');
var Logger = require('../services/logger');
var { parseSchema } = require('../services/func');

var schema = parseSchema(workerData.schema);
var settings = JSON.parse(workerData.settings);
var dataset = JSON.parse(workerData.dataset);
var logger = new Logger();

try {
	if (!schema) {
		throw new Error('Не передана схема');
	}
	if (!dataset) {
		throw new Error('Отсутствуют данные для обучения');
	}

	logger.success('Запуск команды обучения.');
	parentPort.postMessage(train(
		schema,
		dataset,
		'Модель расчёт ферм',
		settings.batch,
		settings.ages,
		settings.limit,
		settings.processor
	));
} catch (err) {
	logger.err(err.message);
	throw err;
}