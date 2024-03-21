require('../services/neyroArr');

var brain = require('brain.js')
var trainedModel = fs.readFileSync('../trained.json');
var InputBuilder = require('../dataset/rankOneInputBuilder');
var Logger = require('../services/logger');
var logger = new Logger('Neyro');

module.exports.calc = (schema) => {
	var builder = new InputBuilder(schema);
	var maxForce = Math.max(...schema.forces.flat().separateNegative());

	logger.info('Старт расчёта ИИ');
	logger.bench('ai');
	var net = (new brain.NeuralNetwork()).fromJSON(JSON.parse(trainedModel));
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