var InputBuilder = require('../dataset/inputBuilder');
var tensorsNet = require('../tensors-trained.js');
var translationsNet = require('../translations-trained.js');

module.exports.calc = (schema) => {
	var builder = new InputBuilder(schema);

	var tensors = tensorsNet(builder.getBarsInput());
	var translations = translationsNet(builder.getNodesInput());

	schema.bars.forEach((bar, i) => {
		bar[3] = tensors[i*6];
	});
	schema.nodes.forEach((node,i)=> {
		i*=2;
		node[2] = translations[i];
		node[3] = translations[i+1];
	});
	return schema;
}