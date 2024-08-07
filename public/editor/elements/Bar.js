import { schema } from '../init.js';
import statusEnum from '../control/StatusEnum.js';
import SchemaElement from '../control/SchemaElement.js';

export default class Bar {
	constructor(start, end) {
		this.start = start;
		this.end = end;

		this.start.link(this);
		this.end.link(this);
		this.EA = 1;

		this.selected = false;
		this.status = statusEnum.new;

		this.tempLink = null;
		this.parent = null;
		this.decline = null;
	}

	toStaticDependencies() {
		if (this.start.parent) {this.start = this.start.parent;}
		if (this.end.parent) {this.end = this.end.parent;}
	}

	toTempDependencies() {
		if (this.start.tempLink) {this.start = this.start.tempLink;}
		if (this.end.tempLink) {this.end = this.end.tempLink;}
	}

	getCopy() {
		return new Bar(this.start, this.end);
	}

	delete() {
		this.status = statusEnum.deleted;
	}

	toggleSelection() {
		this.selected = !this.selected;
	}

	getLength() {
		return Math.sqrt(((this.end.x - this.start.x) ** 2) + ((this.end.y - this.start.y) ** 2)) * schema.scale;
	}

	get proectionX() {
		return this.end.x - this.start.x;
	}

	get proectionY() {
		return this.end.y - this.start.y;
	}

	getRotation() {
		var sin = this.proectionY;
		var cos = this.proectionX;

		var rotation = Math.atan(sin / cos) + Math.PI;
		return rotation*(-1);
	}

	#buildElemPosiotion() {
		this.elem.style.width = this.getLength()+'px';
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
		ctx.moveTo(this.start.drawX, this.start.drawY);
		ctx.lineTo(this.end.drawX, this.end.drawY);
		ctx.stroke();
		if (this.elem) {
			document.body.append(this.elem);
			this.#buildElemPosiotion();
		}
	}
}