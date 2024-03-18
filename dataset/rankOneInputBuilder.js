var mathjs = require('mathjs');
var Logger = require('../services/logger');
var {normalize} = require('../services/func');

module.exports = class InputBuilder {
	constructor(schema) {
		this.schema = schema;
		this.dataset = null;
		this.logger = new Logger('InputRankOneBuilder');
		this.buildDataset(schema);
	}

	getDataset() {
		return this.dataset;
	}

	buildDataset() {
		this.logger.info('Формирование матрицы исходных данных для датасета')
		this.logger.bench('form');

		// для каждого узла 2 координаты, 2 реакции, 2 внешние силы, 2 знака (+ или -) для каждой силы = 8
		this.dataset = Array(this.schema.nodes*8);

		const cords = this.schema.nodes.map(node => [node[0], node[1]]).flat();
		const forces = this.schema.forces.flat();
		const reactions = this.schema.nodes.map(node => [node[2], node[3]]).flat().map(R => R === 0 ? 1 : 0);
		const negativeForces = forces.map(F => Number(F<0));

		this.dataset.push(...(normalize(cords.concat(forces))));
		this.dataset.push(...negativeForces);
		this.dataset.push(...reactions);

		this.logger.success('Формирование матрицы исходных данных для датасета звершено')
		this.logger.bench('form');
	}
}