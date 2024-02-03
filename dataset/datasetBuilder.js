var InputBuilder = require('./inputBuilder');
var OutputBuilder = require('./outputBuilder');
var ShemesBuilder = require('./shcemesBuilder');
var {calc} = require('../resolvers/fem');
var fs = require('fs');

class DatasetBuilder {

	constructor(shBuilder) {
		this.schemesBuilder = shBuilder || new SchemesBuilder();
		this.dataset = {
			tensors: null,
			translations: null
		};
	}

	createDataset(count=20) {
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
	}

	saveTensorsDataset(fileName='./tensors-dataset.json') {
		this.#save('tensors', fileName);
	}

	saveTranslationsDataset(fileName='./translations-dataset.json') {
		this.#save('translations', fileName);
	}

	save() {
		this.saveTensorsDataset();
		this.saveTranslationsDataset();
	}

	#save(datasetName, fileName) {
		fs.writeFileSync(fileName, JSON.stringify(this.dataset[datasetName]), 'utf8');
	}
}