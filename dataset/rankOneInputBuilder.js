require('../services/separateNegative');

var mathjs = require('mathjs');
var Logger = require('../services/logger');
var { normalize } = require('../services/func');

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

		// положительное и отрицательное значение нагрузок и координат идут в разные входные нейроны
		// пример: в узле с нагрузками по x,y [-1, 2], входные нейроны будут [0,1,2,0], до нормализации
		const cords = this.schema.nodes.map(node => [node[0], node[1]]).flat().separateNegative();
		const forces = this.schema.forces.flat().separateNegative();
		const reactions = this.schema.nodes.map(node => [node[2], node[3]]).flat().map(R => R === 0 ? 1 : 0);

		this.dataset = [
			...(normalize(cords.concat(forces))),
			...reactions,
		];

		this.logger.success('Формирование матрицы исходных данных для датасета звершено')
		this.logger.bench('form');
	}
}