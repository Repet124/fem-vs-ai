var path = require('path');
var train = require('./trainer');
var Logger = require('../services/logger');
const {getArgs} = require('../common');
var args = getArgs();

var logger = new Logger();

try {
	if (!args.num) {
		throw new Error('Не указан номер расчётной схемы');
	}
	logger.success('Запуск команды обучения.');
	train(
		path.join(__dirname,`../schemes/${args.num}/dataset.json`),
		path.join(__dirname,`../schemes/${args.num}/trained.json`),
		'Модель расчёт ферм',
		args.batch || 100,
		args.ages || 3,
		args.limit
	);
} catch (err) {
	logger.err(err.message);
	throw err;
}