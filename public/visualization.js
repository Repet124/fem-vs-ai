import { getScale, drawLine } from './common.js'

function drawSchema(ctx, bars, nodes, opacity, color) {
	color = color || '#fff';
	opacity = opacity || 1;
	bars.forEach(bar => 
		drawLine(ctx, nodes[bar[0]], nodes[bar[1]], color, opacity)
	);
}

function drawSchemaWithTensors(ctx, bars, nodes, scale) {
	let max = Math.max(...(bars.map(bar => bar[3])));
	let min = -Math.min(...(bars.map(bar => bar[3])));

	bars.forEach(bar => {
		drawLine(
			ctx,
			nodes[bar[0]],
			nodes[bar[1]],
			getTensorColor(bar[3]*scale/(bar[3]>0 ? max : min)),
			1,
			80*scale
		)
	});

	bars.forEach(bar => {
		let offsetX = (nodes[bar[0]][0]+(nodes[bar[1]][0] - nodes[bar[0]][0])/2)*1000,
			offsetY = (nodes[bar[0]][1]+(nodes[bar[1]][1] - nodes[bar[0]][1])/2)*1000,
			barLength = Math.sqrt((nodes[bar[1]][0] - nodes[bar[0]][0])**2+(nodes[bar[1]][1] - nodes[bar[0]][1])**2),
			rotation = Math.PI/2 - Math.atan((nodes[bar[1]][0] - nodes[bar[0]][0])/(nodes[bar[1]][1] - nodes[bar[0]][1]));
		if (rotation > Math.PI/2) {
			rotation += Math.PI
		}
		ctx.translate(offsetX, offsetY);
		ctx.rotate(rotation);
		drawText(
			bar[3].toFixed(2),
			ctx,
			-400, // offset to start point parallel bar
			(bar[3] < -30 && barLength < 1.2) ? 150 : 50 // the MAGIC
		)
		ctx.rotate(-rotation);
		ctx.translate(-offsetX, -offsetY);
	});
}

function drawText(text, ctx, x, y) {
	ctx.font = '250px sans-serif'
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

function animate(painter, ctx, step=.01, afterCallback) {
	var from = 0;
	var interval = setInterval(() => {
		ctx.clear();
		painter(from);
		if (from >= 1) {
			from = 1;
			clearInterval(interval);
			afterCallback();
		}
		from += step;
	}, 30);
}

function drawCalcsSchema(ctx, schema, scale) {
	let nodes = getDeformNodes(schema.nodes, 10*scale);
	drawSchema(ctx, schema.bars, schema.nodes, .3); // init schema
	drawSchemaWithTensors(ctx, schema.bars, schema.nodes, scale)
}

function numToChanel(num) {
	let chanel = num.toString(16);
	chanel = chanel.length === 1 ? '0' + chanel : chanel;
	return chanel;
}

function getTensorColor(pow) {
	const steps = [
		[0x00,0x27,0xff],
		[0x06,0xb0,0xfc],
		[0xff,0xff,0xff],
		[0xc3,0xe6,0x09],
		[0xff,0x15,0x00],
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

export default function init(canvas) {
	const ctx = canvas.getContext('2d');
	const offset = 50;
	const vertCoff = 1;

	// offset for last schema - DIRT!
	ctx.clear = () => {ctx.clearRect(-offset/this.scale,(-300-offset)/this.scale*vertCoff, canvas.width/this.scale, canvas.height/this.scale)};
	ctx.lineCap = 'round';
	ctx.translate(offset, (canvas.height-offset*vertCoff)-300);

	this.getCanvas = function() {
		return canvas;
	}

	this.show = function(schema) {
		ctx.save();
		this.scale = getScale(canvas.width, canvas.height, schema.nodes, offset);
		ctx.scale(this.scale, -this.scale);
		animate(scale => drawCalcsSchema(ctx, schema, scale), ctx, .03, () => {
			ctx.restore();
		});
	}
}