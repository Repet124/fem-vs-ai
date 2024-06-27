var { parseSchema } = require('../common');
var resolvers = {
	fem: require('./fem'),
	neyro: require('./neyro')
};
var type = process.argv[2];
var schema = parseSchema(process.argv[3]);

if (!resolvers[type]) {
	throw new Error('Resolver is not exisits');
}

process.send(resolvers[type](schema));
