export function getScale(width, height, nodes, offset) {
	let minX = 0,
		maxX = 0,
		minY = 0,
		maxY = 0;
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

export function drawBar(ctx, start, end, color='#fff') {
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.lineWidth = 20;
	ctx.moveTo(start[0], start[1]);
	ctx.lineTo(end[0], end[1]);
	ctx.stroke();
	ctx.closePath();
}