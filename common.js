export function getScale(width, height, nodes, offset) {
	let minX = 0,
		maxX = 0,
		minY = 0,
		maxY = 0;
	nodes.forEach(node => {
		minX = Math.min(minX, node[0]*1000);
		maxX = Math.max(maxX, node[0]*1000);
		minY = Math.min(minY, node[1]*1000);
		maxY = Math.max(maxY, node[1]*1000);
	});
	let scaleX = (width - 2*offset) / (maxX - minX);
	let scaleY = (height - 2*offset) / (maxY - minY);
	return Math.min(scaleX, scaleY);
}

export function drawLine(ctx, start, end, color, opacity) {
	ctx.beginPath();
	ctx.strokeStyle = color;
	ctx.globalAlpha = opacity;
	ctx.lineWidth = 20;
	ctx.moveTo(start[0]*1000, start[1]*1000);
	ctx.lineTo(end[0]*1000, end[1]*1000);
	ctx.stroke();
	ctx.closePath();
}
