require('../services/neyroArr');

var { normalize } = require('../services/func');

module.exports = class OutputBuilder {
	constructor(schema) {
		this.dataset = null;
		this.buildDataset(schema);
	}

	buildDataset(schema) {
		const maxForce = Math.max(...schema.forces.flat().separateNegative());

		let translations = schema.nodes.map(node => [node[2], node[3]]).flat();
		let tensors = schema.bars.map(bar => bar[3]/maxForce);

		// умножение на 2 для добавления выходных узлов указывающих на знак + или - для каждого перемещения и усилия
		this.dataset = [
			...(translations.separateNegative().normalize()),
			...(tensors.separateNegative()),
		];
	}

	getDataset() {
		return this.dataset;
	}
}