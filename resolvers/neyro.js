var InputBuilder = require('../dataset/rankOneInputBuilder');
var net = require('../trained.js');
var Logger = require('../services/logger');
var logger = new Logger('Neyro');

Array.prototype.shiftWithSign = function () {
	let positive = this.shift();
	let negative = this.shift();
	return positive > negative ? positive : (-negative);
}

module.exports.calc = (schema) => {
	var builder = new InputBuilder(schema);

	logger.info('Старт расчёта ИИ');
	logger.bench('ai');
	var result = net(builder.getDataset());

	schema.nodes.forEach(node => {
		node[2] = result.shiftWithSign();
		node[3] = result.shiftWithSign();
	});
	schema.bars.forEach(bar => {
		bar[3] = result.shiftWithSign();
	});

	logger.success('Расчёт завершён');
	logger.bench('ai');
	return schema;
}