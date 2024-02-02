const brain = require('brainjs');
const fs = require('fs');
const {calc} = require('./fem');
var {nodes, bars, forces} = require('./commonSchema');
const iterations = 20;
const forceMax = 20;

function log(txt) {
	console.log('\x1b[33m%s\x1b[0m', '[Dataset Builder]' + txt);
}

function rand(maxPercent) {
	var res = (Math.random()*2-1)*(maxPercent/100);
	return res;
}

function randSwitch(first, second) {
	var res = Math.random() > 0.5 ? first : second;
	return res;
}

function getInput(schema) {
	var result = Array(12);
	for (var i = 0; i < result.length ; i++) {
		result[i] = Array(5);
	}

	return schema.bars.reduce((res, bar, i) => {
		res[0][i] = schema.nodes[bar[0]][0];
		res[1][i] = schema.nodes[bar[0]][1];
		res[2][i] = schema.nodes[bar[1]][0];
		res[3][i] = schema.nodes[bar[1]][1];
		res[4][i] = schema.forces[bar[0]][0];
		res[5][i] = schema.forces[bar[0]][1];
		res[6][i] = schema.forces[bar[1]][0];
		res[7][i] = schema.forces[bar[1]][1];
		res[8][i] = schema.nodes[bar[0]][2] ?? 1;
		res[9][i] = schema.nodes[bar[0]][3] ?? 1;
		res[10][i] = schema.nodes[bar[1]][2] ?? 1;
		res[11][i] = schema.nodes[bar[1]][3] ?? 1;
		return res;
	}, result);
}

function getOutput(schema) {
	return schema.bars.map(bar => Number(bar[3].toFixed(3)));
}

var dataset = Array(iterations);
log('Подготовка данных для метода конечных элементов');
for (var i = 0; i < iterations; i++) {
	nodes = nodes.map(node => [
		Number((node[0]+node[0]*rand(20)).toFixed(3)),
		Number((node[1]+node[1]*rand(20)).toFixed(3)),
		randSwitch(0, undefined),
		randSwitch(0, undefined),
	]);
	forces = forces.map(force => [
		randSwitch(Math.round(forceMax*rand(100)),0),
		randSwitch(Math.round(forceMax*rand(100)),0),
	]);
	dataset[i] = {nodes, bars, forces};
}
log('Данныe сформированны');

log('Расчёт методом конечных элементов');
log('Расчёт завершён');

dataset = dataset.map(schema => ({
	input: getInput(schema),
	output: getOutput(calc(schema))
}));
log('Датасет сформирован');

log('Запись');
fs.writeFile('dataset.json', JSON.stringify(dataset), () => {
	log('Запись завершена');
});
