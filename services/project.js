var fs = require('fs');
var { parseSchema, stringifySchema, deepFreeze, isChangedCalcSchema } = require('./func');

module.exports = class Project {

	#filePath = '';
	#emptySchema = deepFreeze({nodes:[],bars:[],forces:[]});
	#schema = null;
	#settings = null;

	constructor() {
		this.buildEmpty();
	}

	buildEmpty() {
		this.#filePath = '';
		this.#schema = this.#emptySchema;
		this.#settings = null;
		this.trained = '';
		this.dataset = '';
	}

	parse() {
		try {
			var project = fs.readFileSync(this.#filePath, 'utf8');
			var [schema, settings, dataset, trained] = project.split('\n');
			this.schema = parseSchema(schema);
			this.settings = JSON.parse(settings);
			this.dataset = dataset;
			this.trained = trained;
		} catch(e) {
			console.log(e)
			return false;
		}
		return true;
	}

	stringify() {
		return stringifySchema(this.schema)+'\n'
			+JSON.stringify(this.settings)+'\n'
			+this.dataset+'\n'
			+this.trained;
	}

	load(filePath) {
		this.#filePath = filePath;
		return this.parse();
	}

	save(filePath) {
		if (filePath) {
			this.#filePath = filePath
		} else if (!this.#filePath) {
			throw new Error('File path is not exists');
		}
		fs.writeFileSync(this.#filePath, this.stringify(), 'utf8');
		return true;
	}

	set schema(newSchema) {
		if (isChangedCalcSchema(newSchema, this.schema)) {
			this.dataset = '';
			this.trained = '';
		}
		this.#schema = newSchema ? deepFreeze(newSchema) : this.#emptySchema;
	}

	set settings(newSettings) {
		this.#settings = newSettings ? deepFreeze(newSettings) : null;
	}

	get filePath() {
		return this.#filePath;
	}
	get schema() {
		return this.#schema;
	}
	get settings() {
		return this.#settings;
	}

	toFrontend() {
		return {
			filePath: this.filePath,
			schema: this.schema,
			settings: this.settings
		}
	}
}