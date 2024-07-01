var path = require('path');
var train = require('./trainer');
var Logger = require('../services/logger');
var { parseSchema } = require('../services/func');

var schema = parseSchema(process.argv[2]);
var settings = JSON.parse(process.argv[3]);
var dataset = JSON.parse(process.argv[4]);
var logger = new Logger();

try {
	if (!schema) {
		throw new Error('Не передана схема');
	}
	if (!dataset) {
		throw new Error('Отсутствуют данные для обучения');
	}

	logger.success('Запуск команды обучения.');
	process.send(train(
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