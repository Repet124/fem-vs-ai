var { parentPort, workerData } = require('worker_threads');
var DatasetBuilder = require('./datasetBuilder');
var SchemesBuilder = require('./schemesBuilder');
var Logger = require('../services/logger');
var { parseSchema } = require('../services/func');

var schema = parseSchema(workerData.schema);
var settings = JSON.parse(workerData.settings);

var logger = new Logger();

try {
	var builder = new DatasetBuilder();

	logger.success('Запуск команды формирования датасетов');

	builder.buildDataset(new SchemesBuilder(schema), settings.datasetLength || 100);
	parentPort.postMessage(builder.stringify());
} catch (err) {
	logger.err(err.message);
	throw err;
}