import { schema } from '../init.js';
import statusEnum from '../control/StatusEnum.js';
import SchemaElement from '../control/SchemaElement.js';

export default class Bar {
	constructor(start, end) {
		this.start = start;
		this.end = end;
		this.selected = false;
		this.tempLink = null;
		this.parent = null;
		this.status = statusEnum.new;
		this.unlink = null;
		this.delete = null;
	}

	toggleSelection() {
		this.selected = !this.selected;
	}

	getLength() {
		return Math.sqrt(((this.end.x - this.start.x) ** 2) + ((this.end.y - this.start.y) ** 2));
	}

	get proectionX() {
		return this.end.x - this.start.x;
	}

	get proectionY() {
		return this.end.y - this.start.y;
	}

	getRotation() {
		return Math.atan(this.proectionY / this.proectionX)*(-1);
	}

	#buildElemPosiotion() {
		let {x,y} = schema.toPageCords(
			this.start.x + this.proectionX/2,
			this.start.y + this.proectionY/2,
		);
		this.elem.style.transform = `translate(${x - this.getLength()/2}px, ${y}px) rotate(${this.getRotation()}rad)`;
	}

	buildElem() {
		if (this.elem) {
			this.elem.remove();
		}
		this.elem = document.createElement('div');
		this.elem.className = 'barElemJS';
		this.elem.style.width = this.getLength()+'px';
		this.schemaElem = new SchemaElement(this.elem);
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.lineWidth = 5;
		ctx.strokeStyle = this.selected ? 'orange' : 'white';
		if (this.status === statusEnum.new) {
			ctx.strokeStyle = 'rgba(0,0,255,.5)';
		}
		ctx.moveTo(this.start.x, this.start.y);
		ctx.lineTo(this.end.x, this.end.y);
		ctx.stroke();
		if (this.elem) {
			this.#buildElemPosiotion();
			document.body.append(this.elem);
		}
	}
}