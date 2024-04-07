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
		this.#temp.points.push(point);
		return point;
	}

	createBar(start, end) {
		let bar = new Bar(start, end);
		this.#temp.bars.push(point);
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
		this.#forEach(elem => elem.clearListeners());
	}

}