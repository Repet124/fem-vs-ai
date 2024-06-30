import { getScale, drawLine, getMaxMinFromNodes } from './common.js'

function drawSchema(ctx, bars, nodes, opacity, color) {
	color = color || '#fff';
	opacity = opacity || 1;
	bars.forEach(bar => 
		drawLine(ctx, nodes[bar[0]], nodes[bar[1]], color, opacity,0)
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
			10*scale
		)
	});

	bars.forEach(bar => {
		let offsetX = (nodes[bar[0]][0]+(nodes[bar[1]][0] - nodes[bar[0]][0])/2),
			offsetY = (nodes[bar[0]][1]+(nodes[bar[1]][1] - nodes[bar[0]][1])/2),
			barLength = Math.sqrt((nodes[bar[1]][0] - nodes[bar[0]][0])**2+(nodes[bar[1]][1] - nodes[bar[0]][1])**2),
			rotation = Math.PI/2 - Math.atan((nodes[bar[1]][0] - nodes[bar[0]][0])/(nodes[bar[1]][1] - nodes[bar[0]][1]));
		if (rotation > Math.PI/2) {
			rotation += Math.PI
		}
		ctx.translate(offsetX, offsetY);
		ctx.rotate(rotation);
		drawText(bar[3].toFixed(2), ctx, 0, 15);
		ctx.rotate(-rotation);
		ctx.translate(-offsetX, -offsetY);
	});
}

function drawText(text, ctx, x, y) {
	ctx.font = '20px sans-serif'
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

	// offset for last schema - DIRT!
	ctx.clear = () => {ctx.clearRect(-offset,-offset,canvas.width,canvas.height)};
	ctx.lineCap = 'round';
	ctx.translate(offset, canvas.height-offset);

	this.getCanvas = function() {
		return canvas;
	}

	this.buildSchemaPosition = function() {
		var schemaLength = (this.schema.maxX - this.schema.minX);
		var schemaHeight = (this.schema.maxY - this.schema.minY);
		var scale = Math.min(
			(canvas.width - offset*2) / schemaLength,
			(canvas.height - offset*2) / schemaHeight
		);
		var centerTranslation = {
			x: canvas.width/2-offset-schemaLength*scale/2,
			y: canvas.height/2-offset-schemaHeight*scale/2,
		}
		this.schema.nodes = this.baseSchema.nodes.map(node => [
			(node[0]-this.schema.minX)*scale+centerTranslation.x,
			(node[1]-this.schema.minY)*scale+centerTranslation.y,
			node[2],
			node[3]
		]);
	}

	this.show = function(schema) {
		this.baseSchema = schema;
		this.schema = {
			nodes: null,
			bars: schema.bars,
			...getMaxMinFromNodes(schema.nodes)
		};
		ctx.save();
		this.buildSchemaPosition();
		ctx.scale(1, -1);
		animate(scale => drawCalcsSchema(ctx, this.schema, scale), ctx, .03, () => {
			ctx.restore();
		});
	}
}