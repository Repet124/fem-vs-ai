import { schema } from '../init.js';
import statusEnum from '../control/StatusEnum.js';
import SchemaElement from '../control/SchemaElement.js';

export default class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.selected = false;
		this.tempLink = null;
		this.parent = null;
		this.status = statusEnum.new;
		this.unlink = null;
		this.delete = null;
	}

	move(x, y) {
		this.x = x;
		this.y = y;
	}

	toggleSelection() {
		this.selected = !this.selected;
	}

	#buildElemPosiotion() {
		let {x,y} = schema.toPageCords(this.x, this.y);
		this.elem.style.left = x-this.elem.clientWidth/2+'px';
		this.elem.style.top = y-this.elem.clientWidth/2+'px';
	}

	buildElem() {
		if (this.elem) {
			this.elem.remove();
		}
		this.elem = document.createElement('div');
		this.elem.className = 'pointElemJS';
		this.schemaElem = new SchemaElement(this.elem);
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
		ctx.lineWidth = 1;
		ctx.strokeStyle = '#000';
		ctx.fillStyle = this.selected ? 'orange' : 'white';
		if (this.status === statusEnum.new) {
			ctx.fillStyle = 'rgba(21,140,209,.5)';
		} else {
			ctx.stroke();
		}
		ctx.fill();
		if (this.elem) {
			this.#buildElemPosiotion();
			document.body.append(this.elem);
		}
	}
}