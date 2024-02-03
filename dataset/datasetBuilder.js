var fs = require('fs');
var Logger = require('../services/logger');
var InputBuilder = require('./inputBuilder');
var OutputBuilder = require('./outputBuilder');
var ShemesBuilder = require('./shcemesBuilder');
var {calc} = require('../resolvers/fem');

class DatasetBuilder {

	constructor(shBuilder) {
		this.schemesBuilder = shBuilder || new SchemesBuilder();
		this.dataset = {
			tensors: null,
			translations: null
		};
		this.logger = new Logger('DatasetBuilder');
	}

	createDataset(count=20) {
		this.logger.info('Начато формирования датасетов');
		this.logger.bench('dataset');

		this.dataset.tensors = Array(count);
		this.dataset.translations = Array(count);

		this.schemesBuilder.getSchemes(count).forEach((schema,i) => {
			var input = new InputBuilder(schema);
			var output = new OutputBuilder(calc(schema));

			this.dataset.tensors[i] = {
				input: input.getBarsInput(),
				output: output.getForces()
			}
			this.dataset.translations[i] = {
				input: input.getNodesInput(),
				output: output.getTranslations()
			}
		});

		this.logger.success('Датасеты созданы');
		this.logger.bench('dataset');
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
		fs.writeFileSync(fileName, JSON.stringify(this.dataset[datasetName]), 'utf8');
		this.logger.success('Датасет сохранён в ' + fileName);
	}
}