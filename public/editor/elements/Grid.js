import {schema} from '../init.js';

export default class Grid {
	constructor(step=1000) {
		this.step = step;
	}

	#getCountLines(distanse) {
		return Math.ceil(distanse / schema.scale / this.step);
	}

	#drawVerticals(ctx) {
		var count = this.#getCountLines(schema.canvas.htmlNode.width);
		console.log(count)
		Array(count).fill().forEach((_,i) => {
			ctx.moveTo(
				(schema.translateX + i*this.step) * schema.scale,
				0
			);
			ctx.lineTo(
				(schema.translateX + i*this.step) * schema.scale,
				schema.canvas.htmlNode.height,
			);
		})
	}

	#drawHorizontals(ctx) {
		var count = this.#getCountLines(schema.canvas.htmlNode.height);
		Array(count).fill().forEach((_,i) => {
			ctx.moveTo(
				0,
				(schema.translateY + i*this.step) * schema.scale,
			);
			ctx.lineTo(
				schema.canvas.htmlNode.width,
				(schema.translateY + i*this.step) * schema.scale,
			);
		})
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = 'gray';
		ctx.lineWidth = .5;

		this.#drawVerticals(ctx);
		this.#drawHorizontals(ctx);
		ctx.stroke();
	}
}