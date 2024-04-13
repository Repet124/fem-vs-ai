import { schema } from '../init.js';
import statusEnum from '../control/StatusEnum.js';
import SchemaElement from '../control/SchemaElement.js';

export default class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;

		this.support = {
			x: false,
			y: false
		};
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
		copy.support.x = this.support.x;
		copy.support.y = this.support.y;
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

	#drawSupport(ctx) {
		if (!this.support.x && !this.support.y) {return;}
		ctx.fillStyle = '#4ce5c4';
		ctx.strokeStyle = '#000';
		ctx.lineWidth = 3;

		ctx.beginPath();
		ctx.fillRect(this.drawX-20, this.drawY-30, 40, -10);
		ctx.fill();
		ctx.closePath();

		if (!this.support.x) {
			ctx.beginPath();
			ctx.moveTo(this.drawX, this.drawY);
			ctx.lineTo(this.drawX, this.drawY-30);
			ctx.stroke();
			ctx.closePath();
		} else {
			ctx.beginPath();
			ctx.moveTo(this.drawX, this.drawY);
			ctx.lineTo(this.drawX-15, this.drawY-30);
			ctx.moveTo(this.drawX, this.drawY);
			ctx.lineTo(this.drawX+15, this.drawY-30);
			ctx.stroke();
			ctx.closePath();
		}

		ctx.beginPath();
		ctx.moveTo(this.drawX-20, this.drawY-30);
		ctx.lineTo(this.drawX+20, this.drawY-30);
		ctx.stroke();
		ctx.closePath();
	}

	draw(ctx) {
		this.#drawSupport(ctx);
		ctx.beginPath();

		if (this.status === statusEnum.new) {
			ctx.fillStyle = 'rgba(21,140,209,.5)';
		} else {
			ctx.fillStyle = this.selected ? 'orange' : 'white';
			ctx.strokeStyle = '#000';
			ctx.lineWidth = 1;
		}
		ctx.arc(this.drawX, this.drawY, 10, 0, 2 * Math.PI);
		ctx.fill();
		ctx.stroke();
		if (this.elem) {
			document.body.append(this.elem);
			this.#buildElemPosiotion();
		}
	}
}