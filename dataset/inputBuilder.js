var mathjs = require('mathjs');
var Logger = require('../services/logger');

module.exports = class InputBuilder {
	constructor(schema) {
		this.schema = schema;
		this.nodesDataset = null;
		this.barsDataset = null;
		this.logger = new Logger('InputBuilder');
		this.buildDataset(schema);
	}
	getNodesInput() {
		return this.nodesDataset;
	}
	getBarsInput() {
		if (!this.barsDataset) {
			this.barsDataset = mathjs.transpose(this.getNodesInput());
		}
		return this.barsDataset;
	}
	/*
		Датасет для УЗЛОВ
		Матрица:
		\ У З Л Ы
		С|* * * *
		Т|* * * *
		Е|* * * *
		Р|* * * *
		Ж|* * * *
		Н|* * * *
		И|* * * *

		Стержни ассоциированы со строками по 6 строк на каждый.
		Первые 3 строки - начальный узел, вторые 3 - конечный.
		Узлы ассоциированы со столбцами, по 2 столбца на каждый.
		Первый столбец составляющие по оси X, второй по Y.
	*/
	buildDataset() {
		this.logger.info('Формирование матрицы исходных данных для датасета')
		this.logger.bench('form');

		var rows = this.schema.bars.length * 6;
		var columns = this.schema.nodes.length * 2;
		this.nodesDataset = Array(rows);

		for (var i = 0; i < rows; i++) {
			this.nodesDataset[i] = Array(columns);
			this.nodesDataset[i].fill(0);
		}

		this.schema.bars.forEach((bar,i) => {
			i*=6;
			for (var node = 0; node < 2; node++) { // номер узла (начала и конец стержня)
				for (var point = 0; point < 2; point++) { // номер координаты узла (0 -x, 1 - y)
					this.nodesDataset[i][bar[node]*2+point] = this.schema.nodes[bar[node]][point];
					this.nodesDataset[i+1][bar[node]*2+point] = this.schema.nodes[bar[node]][point+2] ?? 1;
					this.nodesDataset[i+2][bar[node]*2+point] = this.schema.forces[bar[node]][point];
				}
				i+=3;
			}
		});

		this.logger.success('Формирование матрицы исходных данных для датасета звершено')
		this.logger.bench('form');
	}
}