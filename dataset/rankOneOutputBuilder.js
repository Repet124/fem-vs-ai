var { normalize } = require('../services/func');

module.exports = class OutputBuilder {
	constructor(schema) {
		this.dataset = null;
		this.buildDataset(schema);
	}

	buildDataset(schema) {
		let translations = schema.nodes.map(node => [node[2], node[3]]).flat();
		let forces = schema.bars.map(bar => bar[3]);

		let negativeTranslations = translations.map(t => Number(t<0));
		let negativeForces = forces.map(f => Number(f<0));

		// умножение на 2 для добавления выходных узлов указывающих на знак + или - для каждого перемещения и усилия
		this.dataset = Array(translations.length*2 + forces.length*2);

		this.dataset.push(...(normalize(translations.concat(forces))));
		this.dataset.push(...negativeTranslations, ...negativeForces);
	}

	getDataset() {
		return this.dataset;
	}
}