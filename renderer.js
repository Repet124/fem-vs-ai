import { getScale, drawLine } from './common.js'
import { nodes, bars } from './schema.js';
import schema from './schema.js';

function drawSchema(ctx, bars, nodes, opacity, color) {
	color = color || '#fff';
	opacity = opacity || 1;
	bars.forEach(bar => 
		drawLine(ctx, nodes[bar[0]], nodes[bar[1]], color, opacity)
	);
}

function getMaxDeform(nodes) {
	let deforms = nodes.map(node => [Math.abs(node[2]), Math.abs(node[3])]).flat();
	return Math.max(...deforms);
}

function getDeformScale(deform, width, height, scalePercent) {
	let maxSize = Math.max(width, height);
	console.log((maxSize/100*scalePercent)/deform)
	return (maxSize/100*scalePercent)/(deform*1000);
}

function drowDeformSchema(ctx, bars, nodes, scale=1) {
	nodes = nodes.map(node => [
		node[0] + node[2] * scale,
		node[1] + node[3] * scale,
	]);
	drawSchema(ctx, bars, nodes, .3);
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const offset = 100;

let scale = getScale(canvas.width, canvas.height, nodes, offset);

ctx.translate(offset, (canvas.height-offset));
ctx.scale(scale, -scale);
ctx.save();

drawSchema(ctx, bars, nodes);

window.api.send(schema)
	.then(nodes => {
		let scale = getDeformScale(getMaxDeform(nodes), canvas.width, canvas.height, 100);
		drowDeformSchema(ctx, schema.bars, nodes, scale);
	})
