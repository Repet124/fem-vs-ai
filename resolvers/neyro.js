var InputBuilder = require('../dataset/rankOneInputBuilder');
var net = require('../trained.js');
var Logger = require('../services/logger');
var logger = new Logger('Neyro');


module.exports.calc = (schema) => {
	var builder = new InputBuilder(schema);

	logger.info('Старт расчёта ИИ');
	logger.bench('ai');
	var result = net(builder.getDataset());

	schema.nodes.forEach(node => {
		node[2] = result.shift();
		node[3] = result.shift();
	});
	schema.bars.forEach(bar => {
		bar[3] = result.shift();
	});

	schema.nodes.forEach(node => {
		node[2] *= (Math.round(result.shift()) ? (-1) : 1);
		node[3] *= (Math.round(result.shift()) ? (-1) : 1);
	});
	schema.bars.forEach(bar => {
		bar[3] *= (Math.round(result.shift()) ? (-1) : 1);
	});

	logger.success('Расчёт завершён');
	logger.bench('ai');
	return schema;
}