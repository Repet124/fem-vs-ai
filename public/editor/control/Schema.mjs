import statusEnum from '#editor-control/StatucEnum';

class Schema {

	constructor(canvas) {
		this.canvas = new SchemaElement(canvas);
		this.#temp = {
			points: [],
			bars: [],
		}
		this.#static  = {
			points: [],
			points: [],
		}
	}

	createPoint(x, y) {
		let cords = this.toSchemaCords(x, y);
		x = cords.x;
		y = cords.y;
		let point = new Point(x,y);
		point.unlink = () => {
			this.#temp.points = this.#temp.points.filter(p => p !== point);
		}
		this.#temp.points.push(point);
		return point;
	}

	createBar(start, end, parent=null) {
		let bar = new Bar(start, end);
		bar.unlink = () => {
			this.#temp.bars = this.#temp.bars.filter(b => b !== bar);
		}
		this.#temp.bars.push(bar);
		return bar;
	}

	getSelection() {
		var result = {
			points: this.#static.points.filter(point => point.selected).map(point => this.#buildChild(
				point,
				createPoint(point.x, point.y)
			)),
			bars: this.#static.bars.filter(bar => bar.selected).map(bar => this.#buildChild(
				bar,
				createBar(bar.start, bar.end)
			)),
		}
	}

	#buildChild(parent, child) {
		child.status = statusEnum.modified;
		parent.tempLink = child;
		child.delete = () => {child.status = statusEnum.deleted;}
		return child;
	}

	commit() {
		for (let entityKey in this.#static) {
			this.#static[entityKey] = this.#static[entityKey]
				// удаляем отмеченные как deleted
				.filter(entity => !entity.tempLink || entity.tempLink.status !== statusEnum.deleted)
				// замещение существующих изменёнными
				.map(entity => {
					if (!entity.tempLink) {return entity;}
					if (entity.tempLink.status === statusEnum.modified) {
						return entity.tempLink;
					}
				})
				// добавление новых элементов
				.concat(this.#temp[entityKey].filter(tempEntity => tempEntity.status === statusEnum.new))
				// обновление статуса всех элементов
				.forEach(entity => entity.status = statusEnum.static);
			// очищение временной схемы
			this.#temp[entityKey] = [];
		}
	}

	decline() {
		this.#temp[entityKey] = [];
	}

	toPageCords(x, y) {
		let {canvasX: x, canvasY: y, canvasHeight: height} = this.canvas.htmlNode.getBoundingClientRect();
		return {
			x: x + canvasX,
			y: canvasHeight - y + canvasY,
		}
	}

	toSchemaCords(x, y) {
		let {canvasX: x, canvasY: y, canvasHeight: height} = this.canvas.htmlNode.getBoundingClientRect();
		return {
			x: x - canvasX,
			y: canvasHeight - (y - canvasY),
		}
	}

	clearListeners() {
		for (let entityKey in this.#static) {
			this.#static[entityKey].forEach(entity => entity.elem.clearListeners());
		}
	}

}