var fs = require('fs');
var path = require('path');
var Logger = require('../services/logger');
var SchemesBuilder = require('./schemesBuilder');
var {calc} = require('../resolvers/fem');
var { stringifySchema } = require('../common');

module.exports = class DatasetBuilder {

	constructor() {
		this.dataset = null;
		this.logger = new Logger('DatasetBuilder');
	}

	buildDataset(schemesBuilder, count) {
		if (!Number.isInteger(count)) {
			throw new Error('Не указано количество расчётных схем');
		}

		this.dataset = null;

		this.logger.success('Начато формирования данных для датасета');
		this.logger.bench('data');

		this.dataset = schemesBuilder
			.getSchemes(count)
			.map(schema => calc(schema));

		this.logger.success('Данные для датасета сформированы');
		this.logger.bench('data');
	}

	save(fileName='./dataset.json') {
		if (!this.dataset) {
			this.logger.err('Сохранение невозможно- датасет не сформирован');
			return;
		}

		var dataset = JSON.stringify(
			this.dataset.map(schema => ({
				tensors: schema.bars.map(bar => bar[3]),
				settedForces: schema.forces.map((f,i) => [i, f]).filter(item => item[1][0] || item[1][1]),
			}))
		);

		fs.writeFileSync(path.join(__dirname,fileName), dataset, 'utf8');
		this.logger.success('Датасет сохранён в ' + fileName);
	}
}