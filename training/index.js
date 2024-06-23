var path = require('path');
var train = require('./trainer');
var Logger = require('../services/logger');
// const {getArgs} = require('../common');
// var args = getArgs();
var { schemaNum, batch, ages, limit } = JSON.parse(process.argv[2]); // training settings

var logger = new Logger();

try {
	if (!schemaNum) {
		throw new Error('Не указан номер расчётной схемы');
	}
	logger.success('Запуск команды обучения.');
	train(
		path.join(__dirname,`../schemes/${schemaNum}/schema.json`),
		path.join(__dirname,`../schemes/${schemaNum}/dataset.json`),
		path.join(__dirname,`../schemes/${schemaNum}/trained.json`),
		'Модель расчёт ферм',
		batch,
		ages,
		limit
	);
} catch (err) {
	logger.err(err.message);
	throw err;
}