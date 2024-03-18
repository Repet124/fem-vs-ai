var DatasetBuilder = require('./datasetBuilder');
var Logger = require('../services/logger');

const {getArgs} = require('../common');
var args = getArgs();

var logger = new Logger();

var countDatasets = args.count || 20;
var builder = new DatasetBuilder();

try {
	logger.success('Запуск команды формирования датасетов');
	builder.buildSources(countDatasets);
	builder.buildDataset();
	builder.save();
} catch (err) {
	logger.err(err.message);
	throw err;
}