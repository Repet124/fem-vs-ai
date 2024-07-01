var fs = require('fs');
var path = require('path');
var Logger = require('../services/logger');
var SchemesBuilder = require('./schemesBuilder');
var calc = require('../resolvers/fem');
var { stringifySchema } = require('../services/func');
var InputBuilder = require('./rankOneInputBuilder');
var OutputBuilder = require('./rankOneOutputBuilder');

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

	stringify() {
		if (!this.dataset) {
			this.logger.err('Сохранение невозможно- датасет не сформирован');
			return;
		}

		return JSON.stringify(
			this.dataset.map(schema => ({
				tensors: schema.bars.map(bar => bar[3]),
				settedForces: schema.forces.map((f,i) => [i, f]).filter(item => item[1][0] || item[1][1]),
			}))
		);
	}

	parse(rawDataset, schema, size) {
		if (size) {
			rawDataset = rawDataset.slice(0, size);
		}

		var dataset = rawDataset.map(schemaChanges => {

			schema.bars.forEach((bar,i) => bar[3] = schemaChanges.tensors[i]);
			schema.forces = Array(schema.forces.length).fill().map(() => [0,0]);

			schemaChanges.settedForces.forEach(iAndF => { // index and force
				schema.forces[iAndF[0]] = iAndF[1];
			});

			return {
				input: new InputBuilder(schema).getDataset(),
				output: new OutputBuilder(schema).getDataset()
			}
		});

		return dataset;
	}
}