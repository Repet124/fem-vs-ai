export function getMaxMinFromNodes(nodes) {
	var minX = nodes[0][0],
		maxX = nodes[0][0],
		minY = nodes[0][1],
		maxY = nodes[0][1];
	nodes.forEach(node => {
		minX = Math.min(minX, node[0]);
		maxX = Math.max(maxX, node[0]);
		minY = Math.min(minY, node[1]);
		maxY = Math.max(maxY, node[1]);
	});
	return {minX,maxX,minY,maxY};
}

export function getScale(width, height, nodes, offset) {
	var {minX,maxX,minY,maxY} = getMaxMinFromNodes(nodes);
	let scaleX = (width - 2*offset) / (maxX - minX);
	let scaleY = (height - 2*offset) / (maxY - minY);
	return Math.min(scaleX, scaleY);
}

export function drawLine(ctx, start, end, color, opacity, weight=10) {
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.globalAlpha = opacity;
	ctx.lineWidth = weight;
	ctx.moveTo(start[0], start[1]);
	ctx.lineTo(end[0], end[1]);
	ctx.stroke();
	ctx.closePath();
	ctx.strokeStyle = '#fff';
}
