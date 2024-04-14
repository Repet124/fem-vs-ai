import statusEnum from './StatusEnum.js';
import SchemaElement from './SchemaElement.js';
import Point from '../elements/Point.js';
import Bar from '../elements/Bar.js';
import Force from '../elements/Force.js';
import Grid from '../elements/Grid.js';

export default class Schema {
	#temp = {
		bars: [],
		points: [],
		forces: [],
	}
	#static  = {
		bars: [],
		points: [],
		forces: [],
	}
	#scale = 1;
	#forceCoff = 0;

	constructor(canvas, scale=0.1) {
		this.document = new SchemaElement(document);
		this.canvas = new SchemaElement(canvas);

		this.ctx = canvas.getContext('2d');
		this.ctx.translate(0, canvas.height);
		this.ctx.scale(1,-1);
		this.ctx.save();

		this.grid = new Grid();
		this.#scale = scale;
		this.translateX = 500;
		this.translateY = 500;

		this.pointSize = 9;
		this.forceSize = 70;
	}

	get scale() {
		return this.#scale;
	}

	setScale(val) {
		if (val < 0.02 || val > .2) {return false}
		this.#scale = val;
		return true;
	}

	createPoint(...construcArgs) {
		return this.#installEntity(new Point(...construcArgs), 'points');
	}

	createBar(...construcArgs) {
		return this.#installEntity(new Bar(...construcArgs), 'bars');
	}

	createForce(...construcArgs) {
		return this.#installEntity(new Force(...construcArgs), 'forces');
	}

	#installEntity(entity, entityArrIdent) {
		entity.decline = () => {
			if (entity.parent) {entity.parent.tempLink = null;}
			this.#temp[entityArrIdent] = this.#temp[entityArrIdent].filter(e => e !== entity);
		}
		this.#temp[entityArrIdent].push(entity);
		return entity;
	}

	getSelection() {
		var result = {};
		for (let entityKey in this.#static) {
			result[entityKey] = this.#static[entityKey]
				.filter(entity => entity.selected)
				.map(entity => this.#buildChild(entity, entityKey));
		}
		return result
	}

	#buildChild(parent, entityKey) {
		const child = this.#installEntity(parent.getCopy(), entityKey)
		child.status = statusEnum.modified;
		child.parent = parent;
		parent.tempLink = child;
		if (parent.links && parent.links.size) {
			parent.links.forEach(link => link.toTempDependencies());
		}
		return child;
	}

	commit() {
		for (let entityKey in this.#static) {
			this.#static[entityKey] = this.#static[entityKey]
				// удаляем отмеченные как deleted
				.filter(entity => 
					(!entity.tempLink || entity.tempLink.status !== statusEnum.deleted) && entity.status !== statusEnum.deleted
				)
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
			this.#temp[entityKey].forEach(entity => {
				if (entity.links && entity.links.size) {
					entity.links.forEach(link => link.toStaticDependencies());
				}
				entity.decline()
			});
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
			x: (x + this.translateX) * this.scale + canvas.x,
			y: canvas.height - (y + this.translateY) * this.scale + canvas.y,
		}
	}

	toSchemaCords(x, y) {
		var canvas = this.canvas.htmlNode.getBoundingClientRect();
		return {
			x: (x - canvas.x) / this.scale - this.translateX,
			y: (canvas.height - (y - canvas.y)) / this.scale - this.translateY,
		}
	}

	clearListeners() {
		this.document.clearListeners();
		this.canvas.clearListeners();
		for (let entityKey in this.#static) {
			this.#static[entityKey].forEach(entity => entity.schemaElem?.clearListeners());
			this.#temp[entityKey].forEach(entity => entity.schemaElem?.clearListeners());
		}
	}

	get forceCoff() {

		if (!this.#forceCoff) {
			var max = this.#static.forces[0];
			this.#static.forces.concat(this.#temp.forces).forEach(force => {
				if(max.absValue < force.absValue) {
					max = force;
				}
			});

			this.#forceCoff = max.absValue / this.forceSize;
		}
		return this.#forceCoff;
	}

	draw() {
		this.ctx.clearRect(0,0,this.canvas.htmlNode.width, this.canvas.htmlNode.height);
		this.grid.draw(this.ctx);

		this.#forceCoff = 0;

		for (let entityKey in this.#static) {
			this.#static[entityKey]
				.map(entity => entity.tempLink || entity)
				.concat(this.#temp[entityKey])
				.forEach(entity => entity.draw(this.ctx));
		}
	}

}