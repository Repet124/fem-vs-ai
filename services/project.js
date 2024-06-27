var fs = require('fs');
var { parseSchema, stringifySchema } = require('./func');

module.exports = class Project {

	#filePath = '';
	#schema = {proxy: null,obj: null};
	#settings = {proxy: null,obj: null};

	constructor() {
		this.buildEmpty();
	}

	buildEmpty() {
		this.#filePath = '';
		this.#schema.obj = null;
		this.#schema.proxy = null;
		this.#settings.obj = null;
		this.#settings.proxy = null;
		this.trained = '';
		this.dataset = '';
	}

	parse() {
		try {
			var project = fs.readFileSync(this.#filePath, 'utf8');
			var [schema, settings, trained, dataset] = project.split('\n');
			this.schema = parseSchema(schema);
			this.settings = JSON.parse(settings);
			this.trained = trained;
			this.dataset = dataset;
		} catch(e) {
			console.log(e)
			return false;
		}
		return true;
	}

	stringify() {
		return stringifySchema(this.#schema)+'\n'
			+JSON.stringify(this.#settings)+'\n'
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
		return fs.writeFileSync(this.#filePath, this.stringify(), 'utf8');
	}

	#buildProxy(component) {
		// same schema, but read only via proxy
		component.proxy = Object.fromEntrice(Object.entries(component.obj).map(([key, val]) => [
			key,
			val.map(item => new Proxy(item, {
				get(target, prop) {
					return target[prop];
				}
			})
		]));
		return component.proxy;
	}

	set schema(newSchema) {
		this.#schema.obj = newSchema;
		this.#schema.proxy = null;
	}

	set settings(newSettings) {
		this.#settings.obj = newSettings;
		this.#settings.proxy = null;
	}

	get filePath() {
		return this.#filePath;
	}
	get schema() {
		return this.#schema.proxy || this.#buildProxy(this.#schema);
	}
	get settings() {
		return this.#settings.proxy || this.#buildProxy(this.#settings);
	}

	toFrontend() {
		return {
			filePath: this.filePath,
			schema: this.schema,
			settings: this.settings
		}
	}
}