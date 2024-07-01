var { parseSchema } = require('../services/func');
var fem = require('./fem');
var neyro = require('./neyro');

var type = process.argv[2];
var schema = parseSchema(process.argv[3]);

if (type === 'fem') {
	process.send(fem(schema));
} else {
	process.send(neyro(schema, JSON.parse(process.argv[4])));
}


