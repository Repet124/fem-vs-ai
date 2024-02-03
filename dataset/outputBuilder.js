module.exports = class OutputBuilder {
	constructor(schema) {
		this.schema = schema;
		// для стержней дублируются данные продольной нагрузки по количеству столбцов в матрице входа для стержня
		this.forcesCount = 6;
	}

	getForces() {
		return this.schema.bars.map(bar => Array(this.forcesCount).fill(bar[3])).flat();
	}

	gerTranslations() {
		return this.schema.nodes.map(node => [node[2], node[3]]).flat();
	}
}