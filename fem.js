const mathjs = require('mathjs');

module.exports.calc = (schema) => {
	// Матрица узловых нагрузок
	const R = mathjs.matrix(schema.forces.flat().map(a => [a]));
	const matrixForBar = mathjs.matrix([
		[1,0,-1,0],
		[0,0,0,0],
		[-1,0,1,0],
		[0,0,0,0]
	]);

	// преобразование стержней от массивов к объектам (а зачем тогда сначала массивы...)
	const bars = schema.bars.map(bar => {
		let start = {
			x: schema.nodes[bar[0]][0],
			y: schema.nodes[bar[0]][1],
		};
		let end = {
			x: schema.nodes[bar[1]][0],
			y: schema.nodes[bar[1]][1],
		};
		return {
			l: Math.sqrt(((end.x - start.x) ** 2) + ((end.y - start.y) ** 2))/1000,
			// на косарь - это приведение к метрам
			EA: bar[2],
		}
	});

	// Матрицы жёсткостей КЭ в локальных системах координат
	const Km = bars.map(bar => mathjs.multiply(matrixForBar, bar.EA/bar.l));
	return Km;
}