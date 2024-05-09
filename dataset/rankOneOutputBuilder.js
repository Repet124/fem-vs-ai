require('../services/neyroArr');

var { normalize } = require('../services/func');

module.exports = class OutputBuilder {
	constructor(schema) {
		this.dataset = null;
		this.buildDataset(schema);
	}

	buildDataset(schema) {
		// const maxForce = Math.max(...schema.forces.flat().separateNegative())*schema.forces.length;

		let translations = schema.nodes.map(node => [node[2], node[3]]).flat();
		let tensors = schema.bars.map(bar => bar[3]).separateNegative();

		const maxForce = Math.max(...tensors);
		tensors = tensors.map(ten => ten/maxForce);

		// умножение на 2 для добавления выходных узлов указывающих на знак + или - для каждого перемещения и усилия
		this.dataset = [
			// ...(translations.separateNegative().normalize()),
			maxForce/100,
			...(tensors),
		];
	}

	getDataset() {
		return this.dataset;
	}
}