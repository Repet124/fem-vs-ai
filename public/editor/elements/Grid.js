import {schema} from '../init.js';

export default class Grid {
	constructor(step=1000) {
		this.step = step;
		this.directions = {x:'x',y:'y'};
	}

	#getCountLines(distanse) {
		return Math.ceil(distanse / schema.scale / this.step) + 3;
	}

	#drawLine(ctx, direction, num, isDrawCord) {
		var perpendicularDirect = direction === 'x' ? 'y' : 'x';
		var translate = schema['translate' + perpendicularDirect.toUpperCase()];
		var start = {}, end = {};

		start[direction] = 0;
		end[direction] = schema.canvas.htmlNode[direction === 'x' ? 'width' : 'height'];
		start[perpendicularDirect] = end[perpendicularDirect] = (translate % this.step + num*this.step) * schema.scale;

		if (isDrawCord) {
			this.#drawCord(
				ctx,
				Math.ceil((num*this.step - translate) / this.step),
				start.x,
				start.y
			);
		}
		ctx.moveTo(start.x, start.y);
		ctx.lineTo(end.x, end.y);
	}

	#drawCord(ctx, val, x, y) {
		ctx.scale(1,-1);
		ctx.strokeText(val+'m', x+5, -y-5);
		ctx.scale(1,-1);
	}

	#isLineWithCordTester() {
		var stepCordsForPx = 200;
		var stepCords = Math.floor(stepCordsForPx / schema.scale / this.step);
		return (num) => num % stepCords === 0;
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = 'gray';
		ctx.lineWidth = .5;
		ctx.font = '10px Arial';

		
		var countHorizontal = this.#getCountLines(schema.canvas.htmlNode.height),
			countVertical = this.#getCountLines(schema.canvas.htmlNode.width),
			isLineWithCord = this.#isLineWithCordTester();

		Array(countHorizontal).fill().forEach((_,i) => this.#drawLine(ctx, this.directions.x, i, isLineWithCord(i)));
		Array(countVertical).fill().forEach((_,i) => this.#drawLine(ctx, this.directions.y, i, isLineWithCord(i)));
		ctx.stroke();
	}
}