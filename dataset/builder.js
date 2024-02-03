var mathjs = require('mathjs');

class Builder {
	constructor(schema) {
		this.schema = schema;
		this.nodesDataset = null;
		this.barsDataset = null;
	}
	getNodesDataset() {
		if (!this.nodesDataset) {
			this.nodesDataset = this.buildDataset(this.schema);
		}
		return this.nodesDataset;
	}
	getBarsDataset() {
		if (!this.barsDataset) {
			this.barsDataset = mathjs.transpose(this.getNodesDataset());
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
		var rows = this.schema.bars * 6;
		var columns = this.schema.nodes.length * 2;
		var dataset = Array(rows);

		for (var i = 0; i < rows; i++) {
			dataset[i] = Array(columns);
			dataset[i].fill(0);
		}

		this.schema.bars.forEach((bar,i) => {
			i*=6;
			for (var node = 0; node < 2; node++) { // номер узла (начала и конец стержня)
				for (var point = 0; point < 2; point++) { // номер координаты узла (0 -x, 1 - y)
					dataset[i][bar[node]*2+point] = this.schema.nodes[bar[node]][point];
					dataset[i+1][bar[node]*2+point] = this.schema.nodes[bar[node]][point+2] ?? 1;
					dataset[i+2][bar[node]*2+point] = this.schema.forces[bar[node]][point];
				}
				i+=3;
			}
		});

		return dataset;
	}
}

module.exports = Builder;