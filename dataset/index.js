const {getArgs, log} = require('../common');
var args = getArgs();

var {nodes, bars, forces} = require('./schemaTemplate');
var forceMax = 20;
var maxPercentTranslations = 20;

if (args) {}

function buildTensorsDataset() {

}

function buildTranslationsDataset() {

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
