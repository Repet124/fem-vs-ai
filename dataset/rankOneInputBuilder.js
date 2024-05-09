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

		this.dataset = this.schema.forces
			.map((force,i) => {
				force = [...force];
				if (this.schema.nodes[i][2] === 0) {
					force.shift();
				} else if(this.schema.nodes[i][3] === 0) {
					force.pop();
				}
				return force;
			})
			.flat()
			.separateNegative();

		// let max = Math.max(...this.dataset);
		let max = 20;
		// let maxForce = 20*this.schema.forces.length/4;
		this.dataset = this.dataset.map(force => force/max);

		// const forces = this.schema.forces.flat();
		// const reactions = this.schema.nodes.map(node => [node[2], node[3]]).flat().map(R => R === 0 ? 1 : 0);

		// this.dataset = [
		// 	// ...(cords.concat(forces).separateNegative().normalize()),
		// 	...(forces.separateNegative().normalize()),
		// 	...reactions,
		// ];

		this.logger.success('Формирование матрицы исходных данных для датасета звершено')
		this.logger.bench('form');
	}
}