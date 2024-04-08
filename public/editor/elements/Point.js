import { schema } from '../init.js';
import statusEnum from '../control/StatucEnum.js';
import SchemaElement from '../control/SchemaElement.js';

export default class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.selected = false;
		this.tempLink = null;
		this.status = statusEnum.new;
		this.unlink = null;
		this.delete = null;
		buildElem();
		this.schemaElem = new SchemaElement(this.elem);
	}

	move(x, y) {
		this.x = x;
		this.y = y;
	}

	toggleSelection() {
		this.selected = !this.selected;
	}

	#buildElemPosiotion() {
		let {x,y} = schema.toPageCords(this.x-this.elem.clientWidth, this.y-this.elem.clientWidth);
		this.elem.style.left = x;
		this.elem.style.top = y;
	}

	buildElem() {
		this.elem = document.createElement('div');
		this.elem.className = 'pointElemJS';
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, 5, 0, 2 * Math.PI);
		ctx.fillStyle = this.selected ? 'orange' : 'white';
		ctx.fill();
		ctx.stroke();
		if (this.elem) {
			this.#buildElemPosiotion();
			document.body.append(this.elem);
		}
	}
}