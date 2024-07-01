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

// Если изменились что либо, КРОМЕ сил, то возвращает true, иначе false
module.exports.isChangedCalcSchema = function(sh1, sh2) {
	// one from schemes is null
	if (!sh1 !== !sh2) {
		return true;
	}
	// different count of nodes or bars
	if (sh1.nodes.length !== sh2.nodes.length || sh1.bars.length !== sh2.nodes.length) {
		return true;
	}

	var nodesAreEqual = sh2.nodes.every((item,i) => 
		// equal cords
		item[0] === sh1.nodes[i][0] && item[1] === sh1.nodes[i][1]
		// equal supports
		&& ((item[2] !== 0 && sh1.nodes[i][2] !== 0) || item[2] === sh1.nodes[i][2])
		&& ((item[3] !== 0 && sh1.nodes[i][3] !== 0) || item[3] === sh1.nodes[i][3])
	);

	var barsAreEqual = sh2.bars.every((item,i) => item[0] === sh1.bars[i][0] && item[1] === sh1.bars[i][1]);

	return !(nodesAreEqual && barsAreEqual);
}

function deepFreeze(object) {

	Object.entries(object).forEach(([_, prop]) => {
		if (prop && (typeof prop === "object" || typeof prop === "function")) {
			deepFreeze(prop);
		}
	});

	return Object.freeze(object);
}

module.exports.deepFreeze = deepFreeze;