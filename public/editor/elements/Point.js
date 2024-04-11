import { schema } from '../init.js';
import statusEnum from '../control/StatusEnum.js';
import SchemaElement from '../control/SchemaElement.js';

export default class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;

		this.links = new Set();
		this.status = statusEnum.new;
		this.selected = false;

		this.tempLink = null;
		this.parent = null;
		this.decline = null;
	}

	get drawX() {
		return (this.x  + schema.translateX)* schema.scale;
	}

	get drawY() {
		return (this.y + schema.translateY) * schema.scale ;
	}

	getCopy() {
		var copy = new Point(this.x, this.y);
		copy.links = this.links;
		return copy;
	}

	link(entity) {
		this.links.add(entity);
	}

	unlink(entity) {
		this.links.delete(entity)
	}

	delete() {
		this.status = statusEnum.deleted;
		this.links.forEach(link => {
			link.delete()
		});
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
		ctx.arc(this.drawX, this.drawY, 10, 0, 2 * Math.PI);
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
			document.body.append(this.elem);
			this.#buildElemPosiotion();
		}
	}
}