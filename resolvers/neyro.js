require('../services/neyroArr');

var InputBuilder = require('../dataset/rankOneInputBuilder');
var Logger = require('../services/logger');
var logger = new Logger('Neyro');
const brain = require('../services/brain.js')

module.exports.calc = (netJson, schema) => {
	const net = (new brain.NeuralNetworkGPU());
	// const net = (new brain.NeuralNetwork());
	net.fromJSON(netJson);

	var builder = new InputBuilder(schema);
	// var maxForce = Math.max(...schema.forces.flat().separateNegative())*schema.forces.length;
	// const maxForce = 20*schema.forces.length/4;
	const maxForce = 50;

	logger.info('Старт расчёта ИИ');
	logger.bench('ai');
	var result = Array.from(net.run(builder.getDataset()));

	schema.nodes.forEach(node => {
		// node[2] = result.shiftWithSign();
		// node[3] = result.shiftWithSign();
		node[2] = 0;
		node[3] = 0;
	});
	var forceCoff = result.shift()*100;
	schema.bars.forEach(bar => {
		bar[3] = result.shiftWithSign()*forceCoff;
	});

	logger.success('Расчёт завершён');
	logger.bench('ai');
	return schema;
}