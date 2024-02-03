var fs = require('fs');
var Logger = require('../services/logger');
var InputBuilder = require('./inputBuilder');
var OutputBuilder = require('./outputBuilder');
var ShemesBuilder = require('./shcemesBuilder');
var {calc} = require('../resolvers/fem');

class DatasetBuilder {

	constructor(shBuilder) {
		this.schemesBuilder = shBuilder || new SchemesBuilder();

		this.sources = null;
		this.dataset = {
			tensors: null,
			translations: null
		};
		this.logger = new Logger('DatasetBuilder');
	}

	getTensorsDataset() {
		if (!this.dataset.tensors) {
			this.sourcesCheck();
			this.logger.info('Формирования датасета для усилий');
			this.dataset.tensors = this.sources.map(source => ({
				input: input.getBarsInput(),
				output: output.getForces()
			}));
			this.logger.info('Формирования датасета для усилий завершено');
		}
		return this.dataset.tensors;
	}

	getTranslatioinsDataset() {
		if (!this.dataset.translations) {
			this.sourcesCheck();
			this.logger.info('Запуск формирования датасета для перемещений');
			this.dataset.translations = this.sources.map(source => ({
				input: input.getNodesInput(),
				output: output.getTranslations()
			}));
			this.logger.info('Формирования датасета для перемещений завершено');
		}
		return this.dataset.translations;
	}

	sourcesCheck() {
		if (!this.sources) {
			throw Error('Невозможно создать датасет - нет исходных данных');
		}
	}

	buildSources(count) {
		if (!Number.isInteger(count)) {
			throw new Error('Не указано количество расчётных схем');
		}

		this.dataset.tensors = null;
		this.dataset.translations = null;

		this.logger.success('Начато формирования данных для датасета');
		this.logger.bench('data');

		this.sources = this.schemesBuilder.getSchemes(count).forEach(schema => ({
			inputs: new InputBuilder(schema),
			outputs: new OutputBuilder(calc(schema))
		}));

		this.logger.success('Данные для датасета сформированы');
		this.logger.bench('data');
	}

	saveTensorsDataset(fileName='./tensors-dataset.json') {
		this.#save('tensors', fileName);
	}

	saveTranslationsDataset(fileName='./translations-dataset.json') {
		this.#save('translations', fileName);
	}

	save() {
		this.logger.info('Сохранение датасетов');
		this.saveTensorsDataset();
		this.saveTranslationsDataset();
	}

	#save(datasetName, fileName) {
		if (!this.dataset[datasetName]) {
			this.logger.err('Невозможно сохранить датасет ' + datasetName + ' - датасет не сформирован');
			return;
		}
		fs.writeFileSync(fileName, JSON.stringify(this.dataset[datasetName]), 'utf8');
		this.logger.success('Датасет сохранён в ' + fileName);
	}
}