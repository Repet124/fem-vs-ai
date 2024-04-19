import { schema } from '../init.js';
import statusEnum from '../control/StatusEnum.js';
import SchemaElement from '../control/SchemaElement.js';

export default class Force {
	#components = null;
	#absValue = 0;

	constructor(point, xComponenet=0, yComponent=-10) {
		this.point = point;
		this.point.link(this);

		this.#components = {
			x: xComponenet,
			y: yComponent,
		}

		this.selected = false;
		this.status = statusEnum.new;

		this.tempLink = null;
		this.parent = null;
		this.decline = null;
	}

	get componentX() {
		return this.#components.x;
	}

	get componentY() {
		return this.#components.y;
	}

	get absValue() {
		return this.#absValue || this.#buildAbsVal();
	}

	get start() {
		return {
			x: this.point.drawX,
			y: this.point.drawY,
		};
	}

	get end() {
		return  {
			x: this.point.drawX - this.#components.x / schema.forceCoff,
			y: this.point.drawY - this.#components.y / schema.forceCoff,
		}
	}

	change(x,y) {
		this.#components.x = x;
		this.#components.y = y;
	}

	#buildAbsVal() {
		this.#absValue = Math.sqrt(this.#components.x ** 2 + this.#components.y ** 2);
		return this.#absValue;
	}

	toStaticDependencies() {
		if (this.point.parent) {this.point = this.point.parent;}
	}

	toTempDependencies() {
		if (this.point.tempLink) {this.point = this.point.tempLink;}
	}

	getCopy() {
		return new Force(this.point, this.#components.x, this.#components.y);
	}

	delete() {
		this.status = statusEnum.deleted;
	}

	toggleSelection() {
		this.selected = !this.selected;
	}

	getRotation() {
		var sin = this.#components.y;
		var cos = this.#components.x;
		var rotation = Math.atan(cos / sin) + Math.PI;
		if (sin < 0) {rotation += Math.PI;}
		return rotation;
	}

	#buildElemPosiotion() {
		let {x,y} = schema.toPageCords(
			this.point.x,
			this.point.y,
		);
		this.elem.style.width = this.absValue/schema.forceCoff+'px';
		this.elem.style.transform = `translate(${x - (this.absValue + this.componentX) / schema.forceCoff / 2}px, ${y + this.componentY / schema.forceCoff / 2}px) rotate(${this.getRotation() + Math.PI / 2}rad)`;
	}

	buildElem() {
		if (this.elem) {
			this.elem.remove();
		}
		this.elem = document.createElement('div');
		this.elem.className = 'forceElemJS';
		this.elem.style.width = this.absValue/schema.forceCoff+'px';
		this.schemaElem = new SchemaElement(this.elem);
	}

	#drawArrow(ctx) {
		let rotation = -this.getRotation();
		let forceText = this.absValue.toFixed(2)+' кН';

		ctx.beginPath();
		ctx.translate(this.start.x, this.start.y);
		ctx.rotate(rotation);
		ctx.translate(0, schema.pointSize);

		ctx.moveTo(0,0);
		ctx.lineTo(10,20);
		ctx.moveTo(0,0);
		ctx.lineTo(-10,20);
		ctx.stroke();

		ctx.closePath();

		ctx.translate(0, -schema.pointSize);
		ctx.rotate(-rotation);
		ctx.translate(this.end.x-this.start.x-20, this.end.y-this.start.y+10);
		ctx.scale(1,-1);

		ctx.font = '16px sans-serif';
		ctx.fillText(forceText, 0, 0);

		ctx.scale(1,-1);
		ctx.translate(-this.end.x+20, -this.end.y-10);
	}

	draw(ctx) {
		this.#absValue = 0;
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.fillStyle = ctx.strokeStyle = this.selected ? 'orange' : '#000';
		ctx.strokeStyle = ctx.strokeStyle = this.selected ? 'orange' : '#000';

		if (this.status === statusEnum.new) {
			ctx.fillStyle = ctx.strokeStyle = 'rgba(0,0,255,.5)';
		}

		ctx.moveTo(this.start.x, this.start.y);
		ctx.lineTo(this.end.x, this.end.y);
		ctx.stroke();

		this.#drawArrow(ctx);

		if (this.elem) {
			document.body.append(this.elem);
			this.#buildElemPosiotion();
		}
	}
}