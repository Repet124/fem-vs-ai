function getInput(schema) {
	var result = Array(12);
	for (var i = 0; i < result.length ; i++) {
		result[i] = Array(5);
	}

	return schema.bars.reduce((res, bar, i) => {
		res[0][i] = schema.nodes[bar[0]][0];
		res[1][i] = schema.nodes[bar[0]][1];
		res[2][i] = schema.nodes[bar[1]][0];
		res[3][i] = schema.nodes[bar[1]][1];
		res[4][i] = schema.forces[bar[0]][0];
		res[5][i] = schema.forces[bar[0]][1];
		res[6][i] = schema.forces[bar[1]][0];
		res[7][i] = schema.forces[bar[1]][1];
		res[8][i] = schema.nodes[bar[0]][2] ?? 1;
		res[9][i] = schema.nodes[bar[0]][3] ?? 1;
		res[10][i] = schema.nodes[bar[1]][2] ?? 1;
		res[11][i] = schema.nodes[bar[1]][3] ?? 1;
		return res;
	}, result);
}

function getOutput(schema) {
	return schema.bars.map(bar => Number(bar[3].toFixed(3)));
}