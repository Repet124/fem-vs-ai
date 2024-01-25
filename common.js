export function getScale(width, height, nodes, offset) {
	let minX, maxX, minY, maxY = 0;
	nodes.forEach(node => {
		minX = Math.min(minX, node[0]);
		maxX = Math.max(maxX, node[0]);
		minY = Math.min(minY, node[1]);
		maxY = Math.max(maxY, node[1]);
	});
	let scaleX = (width - 2*offset) / (maxX - minX);
	let scaleY = (height - 2*offset) / (maxY - minY);
	return Math.min(scaleX, scaleY);
}