

function getMaxBarLength(schema) {
	return schema.bars.map(bar => {
		let start = schema.nodes[bar[0]];
		let end = schema.nodes[bar[1]];
		return Math.sqrt(((end[0] - start[0]) ** 2) + ((end[1] - start[1]) ** 2));
	}).reduce((max, curr) => (curr > max ? curr : max), 0);
}

module.exports = {
	getMaxBarLength
}