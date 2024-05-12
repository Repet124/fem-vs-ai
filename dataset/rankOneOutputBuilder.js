require('../services/neyroArr');

var { normalize } = require('../services/func');

module.exports = class OutputBuilder {
	constructor(schema) {
		this.dataset = null;
		this.buildDataset(schema);
	}

	buildDataset(schema) {

		let translations = schema.nodes.map(node => [node[2], node[3]]).flat();
		let tensors = schema.bars.map(bar => bar[3]).separateNegative().flat();

		const maxForce = Math.max(...tensors);
		tensors = tensors.map(ten => (maxForce ? ten/maxForce : 0));
		const pow = maxForce ? (Math.log(maxForce) / Math.log(1.4))/10 : 0;

		this.dataset = [
			pow,
			...(tensors),
		];
	}

	getDataset() {
		return this.dataset;
	}
}