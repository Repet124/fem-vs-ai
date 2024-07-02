var { parentPort, workerData } = require('worker_threads');
var { parseSchema } = require('../services/func');
var fem = require('./fem');
var neyro = require('./neyro');

var type = workerData.type;
var schema = parseSchema(workerData.schema);

if (type === 'fem') {
	parentPort.postMessage(fem(schema));
} else {
	parentPort.postMessage(neyro(schema, JSON.parse(workerData.trained)));
}


