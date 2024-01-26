const mathjs = require('mathjs');

module.exports.calc = (schema) => {
	// Матрица узловых нагрузок
	const R = mathjs.matrix(schema.forces.flat().map(a => [a]));
	var matrixForBar = mathjs.matrix([
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
			l: Math.sqrt(((end.x - start.x) ** 2) + ((end.y - start.y) ** 2)),
			// на косарь - это приведение к метрам
			EA: bar[2],
			start,
			end,
		}
	});
	var barsCount = bars.length;

	// Матрицы жёсткостей КЭ в локальных системах координат
	const Km = bars.map(bar => mathjs.multiply(matrixForBar, bar.EA/bar.l));

	// Матрицы направляющих косинусов
	const C = bars.map(bar => {
		let cosXx = (bar.end.x - bar.start.x)/bar.l,
			cosYx = (bar.end.y - bar.start.y)/bar.l,
			cosXy = -cosYx,
			cosYy = cosXx;
		return mathjs.matrix([
			[cosXx, cosYx, 0, 0],
			[cosXy, cosYy, 0, 0],
			[0, 0, cosXx, cosYx],
			[0, 0, cosXy, cosYy]
		]);
	});
	// Транспонирование
	const Ct = C.map(c => mathjs.transpose(c))

	// матрицы жёсткости КЭ в глобальный системе координат
	var Ki = Ct.map((ct,i) => mathjs.multiply(mathjs.multiply(ct,Km[i]),C[i]));

	// Формирование матрицы жёсткости системы НЕ связанных КЭ

	var K = mathjs.zeros(
		matrixForBar.size()[0]*barsCount,
		matrixForBar.size()[1]*barsCount
	);
	for (let i=0; i < barsCount; ++i) {
		Ki[i].forEach((val, index) => {
			K.set([index[0]+i*matrixForBar.size()[0], index[1]+i*matrixForBar.size()[1]], val);
		})
	}

	// Формирование матрицы жёсткости системы связанных КЭ

	const E = mathjs.matrix([
		[1,0],
		[0,1],
	]);
	var EStrs = E.size()[0];
	var ECols = E.size()[1];

	// матрица соединения

	var H = mathjs.zeros(
		EStrs*barsCount*2,
		ECols*schema.nodes.length,
	);

	for (var i = 0; i < barsCount; ++i) {
		E.forEach((val, index) => {
			H.set([i*2*EStrs+index[0], schema.bars[i][0]*ECols+index[1]], val);
			H.set([(i*2+1)*EStrs+index[0], schema.bars[i][1]*ECols+index[1]], val);
		})
		
	}

	const transH = mathjs.transpose(H);

	// матрица жёсткости

	var _K = mathjs.multiply(mathjs.multiply(transH, K), H);

	// определение неизвестных перемещений (те, что не запрещают опоры)
	var freeU = schema.nodes
		.map(node => [node[2], node[3]])
		.flat()
		.map((u,i) => [u,i])
		.filter(ui => ui[0] === undefined)
		.map(ui => ui[1]);

	_K = _K.subset(mathjs.index(freeU, freeU));
	const inv_K = mathjs.inv(_K);

	const _R = R.subset(mathjs.index(freeU, 0))
	const _q_temp = mathjs.multiply(inv_K, _R);

	// матрица перемещений

	const _q = mathjs.zeros(R.size()[0], 1);
	freeU.forEach((ui,i) => {
		_q.set([ui, 0], _q_temp.get([i, 0]))
	});

	schema.nodes.forEach((node, i) => {
		node[2] = _q.get([i*2, 0]);
		node[3] = _q.get([i*2+1, 0]);
	});

	return schema.nodes;
}