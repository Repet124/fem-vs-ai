var DatasetBuilder = require('./datasetBuilder');
var SchemesBuilder = require('./schemesBuilder');
var Logger = require('../services/logger');
var { parseSchema } = require('../services/func');

var schema = parseSchema(process.argv[2]);
var settings = JSON.parse(process.argv[3]);

var logger = new Logger();

try {
	var builder = new DatasetBuilder();

	logger.success('Запуск команды формирования датасетов');

	builder.buildDataset(new SchemesBuilder(schema), settings.datasetLength || 100);
	process.send(builder.stringify());
} catch (err) {
	logger.err(err.message);
	throw err;
}