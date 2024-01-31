const brain = require('brainjs');
const fs = require('fs');
const {calc} = require('./fem');
const {nodes, bars, forces} = require('./commonSchema');
const iterations = 1;
const forceMax = 20;

function log(txt) {
	console.log('\x1b[33m%s\x1b[0m', '[Dataset Builder]' + txt);
}

function rand(maxPercent) {
	return (Maht.random()*2-1)*(maxPercent/100);
}

function randSwitch(first, second) {
	return Math.random() > 0.5 ? first : second;
}

function getSource(schema) {
	var input = schema.bars.map(bar => [
		schema.nodes[bar[0]][0],
		schema.nodes[bar[0]][1],
		schema.nodes[bar[1]][0],
		schema.nodes[bar[1]][1],
		schema.forces[bar[0]][0],
		schema.forces[bar[0]][1],
		schema.forces[bar[1]][0],
		schema.forces[bar[1]][1],
		schema.nodes[bar[0]][2] ?? 1,
		schema.nodes[bar[0]][3] ?? 1,
		schema.nodes[bar[1]][2] ?? 1,
		schema.nodes[bar[1]][3] ?? 1,
	]);
	var output = schema.bars.map(bar => bar[3]);
	return {input, output};
}

var dataset = Array(iterations);
log('Подготовка данных для метода конечных элементов');
for (var i = 0; i < iterations; i++) {
	// nodes = nodes.map(node => [
	// 	node[0]*rand(20),
	// 	node[1]*rand(20),
	// 	randSwitch(0, undefined),
	// 	randSwitch(0, undefined),
	// ]);
	// forces = forces.map(force => [
	// 	randSwitch(Math.round(forceMax*rand(100)),0),
	// 	randSwitch(Math.round(forceMax*rand(100)),0),
	// ]);
	dataset[i] = {nodes, bars, forces};
}
log('Данныe сформированны');

log('Расчёт методом конечных элементов');
// dataset = dataset.map(schema => calc(schema));
log('Расчёт завершён');

log('Обработка датасета');
dataset = dataset.map(schema => getSource(schema));
log('Датасет сформирован');

log('Запись');
fs.writeFile('dataset.json', JSON.stringify(dataset), () => {
	log('Запись завершена');
});
