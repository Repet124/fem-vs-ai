var {trainTranslations, trainTensors} = require('./trainer');
var Logger = require('../services/logger');
const {getArgs} = require('../common');
var args = getArgs();

var logger = new Logger();

var startMessage = 'Запуск команды обучения расчёта ';

// дублирование - ну и ладно :Р
try {
	if ('all' in args) {
		logger.success(startMessage + 'усилий и перемещний');
		trainTranslations();
		trainTensors();
	} else if ('tensors' in args) {
		logger.success(startMessage + 'усилий');
		trainTensors();
	} else if ('translations' in args) {
		logger.success(startMessage + 'перемещений');
		trainTranslations();
	} else {
		logger.err('Не указаны параметры выбора датасета для обучения --tensors, --translations или --all');
	}
} catch (err) {
	logger.err(err.message);
	throw err;
}