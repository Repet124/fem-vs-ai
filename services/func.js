module.exports.getArgs = function() {
	var args = {};
	process.argv.slice(2).forEach(arg => {
		var match = arg.match(/--(.*)=(.*)/);
		if (match) {
			args[match[1]] = +match[2] || match[2];
			return;
		}
		match = arg.match(/--?([a-z]*)/);
		if (match) {
			args[match[1]] = true;
		}
	});
	return args;
}

module.exports.getMaxBarLength = function(schema) {
	return schema.bars.map(bar => {
		let start = schema.nodes[bar[0]];
		let end = schema.nodes[bar[1]];
		return Math.sqrt(((end[0] - start[0]) ** 2) + ((end[1] - start[1]) ** 2));
	}).reduce((max, curr) => (curr > max ? curr : max), 0);
}

module.exports.parseSchema = function(schemaJson) {
	var schema = JSON.parse(schemaJson);

	for(let key in schema) {
		schema[key].forEach((entity,i,arr) => {
			arr[i] = entity.map(item => item === 'undefined' ? undefined : item)
		});
	}
	return schema;
}

module.exports.stringifySchema = function(schemaObj) {
	if (!schemaObj) {
		return null;
	}
	var preparedSchema = {};
	for(let key in schemaObj) {
		preparedSchema[key] = schemaObj[key].map(entity => entity.map(item => item === undefined ? 'undefined' : item));
	}
	return JSON.stringify(preparedSchema);
}