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

function getDeformScale(scalePercent, nodes) {
	let maxSize = nodes.reduce((max, node) => Math.max(max, node[0], node[1]), 0);
	return (maxSize/100*scalePercent)/getMaxDeform(nodes);
}

function drowDeformSchema(ctx, bars, nodes, scale=0) {
	scale = getDeformScale(scale, nodes);
	nodes = nodes.map(node => [
		node[0] + node[2] * scale,
		node[1] + node[3] * scale,
	]);
	drawSchema(ctx, bars, nodes, .3);
}

function animateDeform(painter, ctx, from, to, step=.1) {
	var interval = setInterval(() => {
		clearCanvas()
		if (from >= to) {
			from = to;
			clearInterval(interval);
		}
		painter(from);
		from += step;
	}, 30);
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const offset = 100;

let scale = getScale(canvas.width, canvas.height, nodes, offset);

ctx.translate(offset, (canvas.height-offset));
ctx.scale(scale, -scale);
ctx.save();
var clearCanvas = function() {
	ctx.clearRect(-offset/scale,-offset/scale, canvas.width/scale, canvas.height/scale);
}

drawSchema(ctx, bars, nodes);

// document.getElementById('calc').addEventListener('click', e => {

window.api.send(schema)
	.then(schema => {
		animateDeform((scale) => {
			drawSchema(ctx, schema.bars, schema.nodes)
			drowDeformSchema(ctx, schema.bars, schema.nodes, scale);
		}, ctx, 0, 10, .3)
	})
// })

