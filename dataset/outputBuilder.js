module.exports = class OutputBuilder {
	constructor(schema) {
		// для стержней дублируются данные продольной нагрузки по количеству столбцов в матрице входа для стержня
		this.forcesCount = 6;
		this.forces = null;
		this.translations = null;
		this.buildDataset(schema);
	}

	buildDataset(schema) {
		this.forces = schema.bars.map(bar => Array(this.forcesCount).fill(bar[3])).flat();
		this.translations = schema.nodes.map(node => [node[2], node[3]]).flat();
	}

	getForces() {
		return this.forces;
	}

	gerTranslations() {
		return this.translations;
	}
}