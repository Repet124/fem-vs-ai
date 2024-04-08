import statusEnum from './StatusEnum.js';
import SchemaElement from './SchemaElement.js';
import Point from '../elements/Point.js';
import Bar from '../elements/Bar.js';

export default class Schema {
	#temp = {
		bars: [],
		points: [],
	}
	#static  = {
		bars: [],
		points: [],
	}

	constructor(canvas) {
		this.canvas = new SchemaElement(canvas);
		this.ctx = canvas.getContext('2d');
		this.ctx.translate(0, canvas.height);
		this.ctx.scale(1,-1);
	}

	createPoint(x, y) {
		return this.#createEntity(Point, [x, y], 'points');
	}

	createBar(start, end) {
		return this.#createEntity(Bar, [start, end], 'bars');
	}

	#createEntity(constructFunc, constructArgs, entityArrIdent) {
		var entity = new constructFunc(...constructArgs);
		entity.unlink = () => {
			if (entity.parent) {entity.parent.tempLink = null;}
			this.#temp[entityArrIdent] = this.#temp[entityArrIdent].filter(e => e !== entity);
		}
		this.#temp[entityArrIdent].push(entity);
		return entity;
	}

	getSelection() {
		var result = {
			points: this.#static.points.filter(point => point.selected).map(point => this.#buildChild(
				point,
				this.createPoint(point.x, point.y)
			)),
			bars: this.#static.bars.filter(bar => bar.selected).map(bar => this.#buildChild(
				bar,
				this.createBar(bar.start, bar.end)
			)),
		}
		return result
	}

	#buildChild(parent, child) {
		child.status = statusEnum.modified;
		child.parent = parent;
		parent.tempLink = child;
		child.delete = () => child.status = statusEnum.deleted;
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
				.concat(this.#temp[entityKey].filter(tempEntity => tempEntity.status === statusEnum.new));

			// обновление статуса всех элементов
			this.#static[entityKey].forEach(entity => {
				entity.buildElem();
				entity.status = statusEnum.static
			});
			// очищение временной схемы
			this.#temp[entityKey] = [];
		}
	}

	decline() {
		for (let entityKey in this.#temp) {
			this.#temp[entityKey].forEach(entity => entity.unlink());
			this.#temp[entityKey] = [];
		}
	}

	selectModeOn() {
		for (let entityKey in this.#static) {
			this.#static[entityKey].forEach(entity => {
				entity.schemaElem.addListener('click', () => {
					entity.toggleSelection();
					this.draw();
				})
			});
		}
	}

	unselect() {
		for (let entityKey in this.#static) {
			this.#static[entityKey].forEach(entity => {
				entity.selected = false;
			});
		}
	}

	toPageCords(x, y) {
		var canvas = this.canvas.htmlNode.getBoundingClientRect();
		return {
			x: x + canvas.x,
			y: canvas.height - y + canvas.y,
		}
	}

	toSchemaCords(x, y) {
		var canvas = this.canvas.htmlNode.getBoundingClientRect();
		return {
			x: x - canvas.x,
			y: canvas.height - (y - canvas.y),
		}
	}

	clearListeners() {
		this.canvas.clearListeners();
		for (let entityKey in this.#static) {
			this.#static[entityKey].forEach(entity => entity.schemaElem.clearListeners());
			this.#temp[entityKey].forEach(entity => entity.schemaElem.clearListeners());
		}
	}

	draw() {
		this.ctx.clearRect(0,0,this.canvas.htmlNode.width, this.canvas.htmlNode.height);
		for (let entityKey in this.#static) {
			this.#static[entityKey].forEach(entity => !entity.tempLink && entity.draw(this.ctx));
			this.#temp[entityKey].forEach(entity => entity.draw(this.ctx));
		}
	}

}