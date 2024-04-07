import schema from '#editor-control/Schema';
import statusEnum from '#editor-control/StatucEnum';

export default class Bar {
	constructor(start, end) {
		this.start = start;
		this.end = end;
		this.selected = false;
		this.tempLink = null;
		this.status = statusEnum.new;
		this.unlink = null;
		this.delete = null;
		buildElem();
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
		return Math.atan(this.proectionY / this.proectionX)
	}

	#buildElemPosiotion() {
		let {x,y} = schema.toPageCords(
			this.start.x + this.proectionX/2,
			this.start.y + this.proectionY/2,
		);
		this.elem.style.transform = `translate(${x}px, ${y}px), rotate(${this.getRotation()}rad)`;
	}

	buildElem() {
		this.elem = document.createElement('div');
		this.elem.className = 'barElemJS';
		this.elem.style.width = this.getLength();
	}

	draw(ctx) {
		ctx.beginPath();
		ctx.strokeStyle = this.selected ? 'orange' : 'white';
		ctx.stroke();

		this.#buildElemPosiotion();
		document.body.append(this.elem);
	}
}