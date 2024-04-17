require('../services/neyroArr');

var InputBuilder = require('../dataset/rankOneInputBuilder');
var Logger = require('../services/logger');
var logger = new Logger('Neyro');

module.exports.calc = (net, schema) => {
	var builder = new InputBuilder(schema);
	var maxForce = Math.max(...schema.forces.flat().separateNegative());

	logger.info('Старт расчёта ИИ');
	logger.bench('ai');
	var result = net(builder.getDataset());

	schema.nodes.forEach(node => {
		node[2] = result.shiftWithSign();
		node[3] = result.shiftWithSign();
	});
	schema.bars.forEach(bar => {
		bar[3] = result.shiftWithSign()*maxForce;
	});

	logger.success('Расчёт завершён');
	logger.bench('ai');
	return schema;
}