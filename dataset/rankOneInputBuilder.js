require('../services/neyroArr');

var mathjs = require('mathjs');
var Logger = require('../services/logger');

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

		// назначение separateNegative:
		// положительное и отрицательное значение нагрузок идут в разные входные нейроны
		// пример: в узле с нагрузками по x,y [-1, 2], входные нейроны будут [0,1,2,0], до нормализации

		// const cords = this.schema.nodes.map(node => [node[0], node[1]]).flat();
		this.dataset = this.schema.forces.flat();

		this.logger.success('Формирование матрицы исходных данных для датасета звершено')
		this.logger.bench('form');
	}
}