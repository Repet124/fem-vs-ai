var fs = require('fs');
var path = require('path');
var Logger = require('../services/logger');
var InputBuilder = require('./rankOneInputBuilder');
var OutputBuilder = require('./rankOneOutputBuilder');
var SchemesBuilder = require('./schemesBuilder');
var {calc} = require('../resolvers/fem');
var { stringifySchema } = require('../common');

module.exports = class DatasetBuilder {

	constructor(shBuilder) {
		this.schemesBuilder = shBuilder;

		this.dataset = null;
		this.logger = new Logger('DatasetBuilder');
	}

	buildDataset(count) {
		if (!Number.isInteger(count)) {
			throw new Error('Не указано количество расчётных схем');
		}

		this.dataset = null;

		this.logger.success('Начато формирования данных для датасета');
		this.logger.bench('data');

		this.dataset = this.schemesBuilder
			.getSchemes(count)
			.map(schema => stringifySchema(calc(schema)))
			.join('\n');

		this.logger.success('Данные для датасета сформированы');
		this.logger.bench('data');
	}

	save(fileName='./dataset.json') {
		if (!this.dataset) {
			this.logger.err('Сохранение невозможно- датасет не сформирован');
			return;
		}
		fs.writeFileSync(path.join(__dirname,fileName), this.dataset, 'utf8');
		this.logger.success('Датасет сохранён в ' + fileName);
	}
}