var DatasetBuilder = require('./datasetBuilder');
var SchemesBuilder = require('./schemesBuilder');
var Logger = require('../services/logger');

const {getArgs} = require('../common');
var args = getArgs();

var logger = new Logger();

var countDatasets = args.count || 100;

try {
	var builder = new DatasetBuilder(new SchemesBuilder(args.num));
	logger.success('Запуск команды формирования датасетов');
	builder.buildDataset(countDatasets);
	builder.save(`../schemes/${args.num}/dataset.json`);
} catch (err) {
	logger.err(err.message);
	throw err;
}