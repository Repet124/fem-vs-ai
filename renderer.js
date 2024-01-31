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

	bars.forEach(bar => {
		drawText(
			bar[3].toFixed(2),
			ctx,
			(nodes[bar[0]][0]+(nodes[bar[1]][0] - nodes[bar[0]][0])/2)*1000,
			(nodes[bar[0]][1]+(nodes[bar[1]][1] - nodes[bar[0]][1])/2)*1000,
		)
	});
}

function drawText(text, ctx, x, y) {
	ctx.font = '200px sans-serif'
	ctx.fillStyle = '#fff'
	ctx.scale(1, -1)
	ctx.fillText(text, x, -y);
	ctx.scale(1, -1)
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
		ctx.clear();
		if (from >= 1) {
			from = 1;
			clearInterval(interval);
		}
		painter(from);
		from += step;
	}, 30);
}

function drawCalsSchema(schema, scale) {
	let nodes = getDeformNodes(schema.nodes, 10*scale);
	drawSchema(ctx, schema.bars, schema.nodes, .3); // init schema
	drawSchemaWithTensors(ctx, schema.bars, nodes, scale)
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

	pow = pow*2+2;
	let index = Math.trunc(pow);
	let percent = (pow-index)*100;

	if(index >= 4) {return '#'+steps[4].reduce((res,chanel) => res+numToChanel(chanel),'')};
	if(index <= 0) {return '#'+steps[0].reduce((res,chanel) => res+numToChanel(chanel),'')};

	let colors = Array(3);
	for (var i = 0; i < 3; i++) {
		colors[i] = Math.round((steps[index+1][i] - steps[index][i])*0.01*percent + steps[index][i]);
	}
	return '#'+colors.reduce((res,chanel) => res+numToChanel(chanel),'');
}

const calcFemBtn = document.getElementById('calcFem');
const calcNeyroBtn = document.getElementById('calcNeyro');

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const offset = 100;
const scale = getScale(canvas.width, canvas.height, nodes, offset);
ctx.clear = function() {this.clearRect(-offset/scale,-offset/scale, canvas.width/scale, canvas.height/scale)};

ctx.translate(offset, (canvas.height-offset));
ctx.scale(scale, -scale);
ctx.lineCap = 'round';
ctx.save();

drawSchema(ctx, bars, nodes);

calcFemBtn.onclick = () => {

	window.api.fem(schema).then(schema => {
		animate(scale => drawCalsSchema(schema, scale), ctx, .03);
	});

}

calcNeyroBtn.onclick = () => {

	window.api.neyro(schema).then(schema => {
		animate(scale => drawCalsSchema(schema, scale), ctx, .03);
	});

}