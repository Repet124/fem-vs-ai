var train = require('./trainer');
var Logger = require('../services/logger');
const {getArgs} = require('../common');
var args = getArgs();

var logger = new Logger();

try {
	logger.success('Запуск команды обучения.');
	train('./dataset.json', './trained.js', 'Модель расчёт ферм');
} catch (err) {
	logger.err(err.message);
	throw err;
}