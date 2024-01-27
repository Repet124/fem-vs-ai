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

function drawSchemaWithTensors(ctx, bars, nodes, scale) {
	let max = bars.reduce((max,bar) => Math.max(max, Math.abs(bar[3])), 1);
	bars.forEach(bar => {
		drawLine(ctx, nodes[bar[0]], nodes[bar[1]], getTensorColor(bar[3]*scale/max), 1, 80*scale)
	});
}

function getDeformNodes(nodes, scale=0) {
	scale = getDeformScale(scale, nodes);
	return nodes.map(node => [
		node[0] + node[2] * scale,
		node[1] + node[3] * scale,
	]);
}

function getMaxDeform(nodes) {
	let deforms = nodes.map(node => [Math.abs(node[2]), Math.abs(node[3])]).flat();
	return Math.max(...deforms);
}

function getDeformScale(scalePercent, nodes) {
	let maxSize = nodes.reduce((max, node) => Math.max(max, node[0], node[1]), 0);
	return (maxSize/100*scalePercent)/getMaxDeform(nodes);
}

function animate(painter, ctx, step=.01) {
	var from = 0;
	var interval = setInterval(() => {
		clearCanvas()
		if (from >= 1) {
			from = 1;
			clearInterval(interval);
		}
		painter(from);
		from += step;
	}, 30);
}

function numToChanel(num) {
	let chanel = num.toString(16);
	chanel = chanel.length === 1 ? '0' + chanel : chanel;
	return chanel;
}

function getTensorColor(pow) {
	const steps = [
		[0xff,0x15,0x00],
		[0xc3,0xe6,0x09],
		[0xff,0xff,0xff],
		[0x06,0xb0,0xfc],
		[0x00,0x27,0xff],
	];
	if(pow >= 1) {return '#'+steps[4].reduce((res,chanel) => res+numToChanel(chanel),'')};
	if(pow <= -1) {return '#'+steps[0].reduce((res,chanel) => res+numToChanel(chanel),'')};

	pow = pow*2+2;
	let index = Math.trunc(pow);
	let percent = (pow-index)*100;
	let colors = Array(3);
	for (var i = 0; i < 3; i++) {
		colors[i] = Math.round((steps[index+1][i] - steps[index][i])*0.01*percent + steps[index][i]);
	}
	return '#'+colors.reduce((res,chanel) => res+numToChanel(chanel),'');
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const offset = 100;

let scale = getScale(canvas.width, canvas.height, nodes, offset);

ctx.translate(offset, (canvas.height-offset));
ctx.scale(scale, -scale);
ctx.lineCap = 'round';
ctx.save();
var clearCanvas = function() {
	ctx.clearRect(-offset/scale,-offset/scale, canvas.width/scale, canvas.height/scale);
}

drawSchema(ctx, bars, nodes);
document.getElementById('calc').addEventListener('click', e => {

window.api.send(schema)
	.then(schema => {
		animate((scale) => {
			let nodes = getDeformNodes(schema.nodes, 10*scale);
			drawSchema(ctx, schema.bars, schema.nodes, .3); // init schema
			drawSchemaWithTensors(ctx, schema.bars, nodes, scale)
		}, ctx, .03)
	})
})

