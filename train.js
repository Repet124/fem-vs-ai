const brain = require('brain.js')
const fs = require('fs');

function log(txt) {
	console.log('\x1b[33m%s\x1b[0m', '[Neyro]' + txt);
}

const dataset = JSON.parse(fs.readFileSync('./dataset.json'));
const net = new brain.recurrent.LSTMTimeStep({
	inputSize: 5,
	hiddenLayers: [10],
	outputSize: 5,
	log: true,
	logPeriod: 10
});

log('Старт обучения');
net.train(dataset.map(obj => [...obj.input, obj.output]));

log('Сохранение результатов');
fs.writeFileSync('model.js', net.toFunction().toString(), 'utf8');
log('Обучение завершено');