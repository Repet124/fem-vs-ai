var fs = require('fs');
var Logger = require('../services/logger');
var InputBuilder = require('./inputBuilder');
var OutputBuilder = require('./outputBuilder');
var SchemesBuilder = require('./schemesBuilder');
var {calc} = require('../resolvers/fem');

module.exports = class DatasetBuilder {

	constructor(shBuilder) {
		this.schemesBuilder = shBuilder || new SchemesBuilder();

		this.sources = null;
		this.dataset = {
			tensors: null,
			translations: null
		};
		this.logger = new Logger('DatasetBuilder');
	}

	buildTensorsDataset() {
		if (!this.dataset.tensors) {
			this.sourcesCheck();
			this.logger.info('Формирования датасета для усилий');
			this.dataset.tensors = this.sources.map(source => ({
				input: source.input.getBarsInput(),
				output: source.output.getForces()
			}));
			this.logger.info('Формирования датасета для усилий завершено');
		}
		return this.dataset.tensors;
	}

	buildTranslationsDataset() {
		if (!this.dataset.translations) {
			this.sourcesCheck();
			this.logger.info('Запуск формирования датасета для перемещений');
			this.dataset.translations = this.sources.map(source => ({
				input: source.input.getNodesInput(),
				output: source.output.getTranslations()
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

		this.sources = this.schemesBuilder.getSchemes(count).map(schema => ({
			input: new InputBuilder(schema),
			output: new OutputBuilder(calc(schema))
		}));

		this.logger.success('Данные для датасета сформированы');
		this.logger.bench('data');
	}

	saveTensors(fileName='./tensors-dataset.json') {
		this.#save('tensors', fileName);
	}

	saveTranslations(fileName='./translations-dataset.json') {
		this.#save('translations', fileName);
	}

	saveAll() {
		this.logger.info('Сохранение датасетов');
		this.saveTensors();
		this.saveTranslations();
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