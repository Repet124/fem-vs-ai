var fs = require('fs');
var Logger = require('../services/logger');
var InputBuilder = require('./rankOneInputBuilder');
var OutputBuilder = require('./rankOneOutputBuilder');
var SchemesBuilder = require('./schemesBuilder');
var {calc} = require('../resolvers/fem');

module.exports = class DatasetBuilder {

	constructor(shBuilder) {
		this.schemesBuilder = shBuilder || new SchemesBuilder();

		this.sources = null;
		this.dataset = null;
		this.logger = new Logger('DatasetBuilder');
	}

	buildDataset() {
		if (!this.dataset.common) {
			this.sourcesCheck();
			this.logger.info('Запуск формирования общего датасета');
			this.dataset = this.sources.map(source => ({
				input: source.input.getDataset(),
				output: source.output.getDataset()
			}));
			this.logger.info('Формирования датасета для перемещений завершено');
		}
		return this.dataset;
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

		this.dataset = null;

		this.logger.success('Начато формирования данных для датасета');
		this.logger.bench('data');

		this.sources = this.schemesBuilder.getSchemes(count).map(schema => ({
			input: new InputBuilder(schema),
			output: new OutputBuilder(calc(schema))
		}));

		this.logger.success('Данные для датасета сформированы');
		this.logger.bench('data');
	}

	save(fileName='./dataset.json') {
		if (!this.dataset) {
			this.logger.err('Сохранение невозможно- датасет не сформирован');
			return;
		}
		fs.writeFileSync(fileName, JSON.stringify(this.dataset), 'utf8');
		this.logger.success('Датасет сохранён в ' + fileName);
	}
}