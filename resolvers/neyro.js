require('../services/neyroArr');

var InputBuilder = require('../dataset/rankOneInputBuilder');
var Logger = require('../services/logger');
var logger = new Logger('Neyro');
const brain = require('../services/brain.js')

module.exports = function(schema, netJson) {
	const net = (new brain.NeuralNetworkGPU());
	// const net = (new brain.NeuralNetwork());
	net.fromJSON(netJson);

	var builder = new InputBuilder(schema);

	logger.info('Старт расчёта ИИ');
	logger.bench('ai');
	var result = Array.from(net.run(builder.getDataset()));

	schema.nodes.forEach(node => {
		// node[2] = result.shiftWithSign();
		// node[3] = result.shiftWithSign();
		node[2] = 0;
		node[3] = 0;
	});
	var forceCoff = result.shift()*10;
	schema.bars.forEach(bar => {
		bar[3] = result.shiftWithSign() * (1.65** forceCoff);
	});

	logger.success('Расчёт завершён');
	logger.bench('ai');
	return schema;
}