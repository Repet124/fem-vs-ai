const getSchemes = require('./shcemesBuilder');


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
