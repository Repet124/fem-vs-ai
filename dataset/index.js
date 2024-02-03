var DatasetBuilder = require('./datasetBuilder');
var Logger = require('../services/logger');

const {getArgs} = require('../common');
var args = getArgs();

var logger = new Logger();

var startMessage = 'Запуск команды формирования ';
var countDatasets = args.count || 1;
var builder = new DatasetBuilder();

// дублирование - ну и ладно :Р
try {
	if ('all' in args) {
		logger.success(startMessage + 'всех датасетов');
		builder.buildSources(countDatasets);
		builder.buildTensorsDataset();
		builder.buildTranslationsDataset();
		builder.saveAll();
	} else if ('tensors' in args) {
		logger.success(startMessage + 'датасетов для усилий');
		builder.buildSources(countDatasets);
		builder.buildTensorsDataset();
		builder.saveTensors();
	} else if ('translations' in args) {
		logger.success(startMessage + 'датасетов для перемещений');
		builder.buildSources(countDatasets);
		builder.buildTranslationsDataset();
		builder.saveTranslations();
	} else {
		logger.err('Не указаны параметры выбора датасета --tensors, --translations или --all');
	}
} catch (err) {
	logger.err(err.message);
	throw err;
}