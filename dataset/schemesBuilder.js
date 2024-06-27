const fs = require('fs');
const path = require('path');

module.exports = class SchemesBuilder {

	constructor(schema, forceMax=20, maxPercentTranslations=20) {
		this.template = schema;
		this.forceMax = 40;
		this.maxDistanceChange = 1;
	}

	getSchemes(count) {
		if (count % 10 !== 0) {
			throw new Error('Размер датасета должен быть кратен 10');
		}
		var data = Array(count);

		for (var i = 0; i < count; ) {
			// // схемы с горизонтальными усилиями
			// data[i++] = this.#buildSchema(.1, 0);
			// data[i++] = this.#buildSchema(.2, 0);
			// data[i++] = this.#buildSchema(.3, 0);
			// data[i++] = this.#buildSchema(.5, 0);

			// // схемы с вертикальными усилиями
			// data[i++] = this.#buildSchema(0, .1);
			// data[i++] = this.#buildSchema(0, .2);
			// data[i++] = this.#buildSchema(0, .3);
			// data[i++] = this.#buildSchema(0, .5);

			// // схемы с усилиями в обих направлениях
			// data[i++] = this.#buildSchema(.2, .2);
			// data[i++] = this.#buildSchema(.5, .5);

			data[i++] = this.#buildSchema(.3, .3);
			data[i++] = this.#buildSchema(.3, .3);
			data[i++] = this.#buildSchema(.3, .3);
			data[i++] = this.#buildSchema(.3, .3);
			data[i++] = this.#buildSchema(.3, .3);
			// data[i++] = this.#buildSchema(.3, .3);
			// data[i++] = this.#buildSchema(.3, .3);
			// data[i++] = this.#buildSchema(.3, .3);
			// data[i++] = this.#buildSchema(.3, .3);
			// data[i++] = this.#buildSchema(.3, .3);
			data[i++] = this.#buildSchema(1, 1);
			data[i++] = this.#buildSchema(1, 1);
			data[i++] = this.#buildSchema(1, 1);
			data[i++] = this.#buildSchema(1, 1);
			data[i++] = this.#buildSchema(1, 1);
		}
		return data;
	}

	#buildSchema(chanceX, chanceY) {
		var schema = {
			// копирование узлов и стержней без изменений
			nodes: this.template.nodes.map(node => [...node]),
			bars: this.template.bars.map(bar => [...bar]),
			// назначение усилий в зависимости от их шанса появления в определённом направлении
			forces: this.template.forces.map(() => ([
				(Math.random() <= chanceX) ? Number((this.forceMax*rand(100)).toFixed(1)) : 0,
				(Math.random() <= chanceY) ? Number((this.forceMax*rand(100)).toFixed(1)) : 0
			])),
		}
		return schema;
	}
}

function rand(maxPercent) {
	var res = (Math.random()*2-1)*(maxPercent/100);
	return res;
}

function randSwitch(first, second) {
	var res = (Math.random() > 0.5) ? first : second;
	return res;
}