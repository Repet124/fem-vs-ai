var fs = require('fs');
var { parseSchema, stringifySchema } = require('./common');

module.exports = class Project {

	#filePath;
	#schema;
	#settings;
	#trained;
	#dataset;

	#schemaProxy = {
		actual: true,
		obj: null
	};

	constructor() {
		this.buildEmpty();
	}

	buildEmpty() {
		this.#filePath = '';
		this.#schema = null;
		this.#settings = null;
		this.#trained = '';
		this.#dataset = '';
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
			+this.#dataset+'\n'
			+this.#trained;
	}

	load(filePath) {
		this.filePath = filePath;
		return this.parse();
	}

	save() {
		if (!this.#filePath) {
			throw new Error('File path is not exists');
		}
		return fs.writeFileSync(filePath, this.stringify());
	}

	toFrontend() {
		return {
			schema: this.#schem.valuea
		}
	}

	#buildSchemaProxy() {
		// same schema, but read only via proxy
		this.#schemaProxy.obj = Object.fromEntrice(Object.entries(this.#schema).map(([key, val]) => [
			key,
			val.map(item => new Proxy(item, {
				get(target, prop) {
					return target[prop];
				}
			})
		]));
	}

	set filePath() {}
	set schema() {}
	set settings() {}
	set trained() {}
	set dataset() {}

	get filePath() {}
	get schema() {
		if (!this.#schemaProxy.actual || !this.#schemaProxy.obj) {
			this.#buildSchemaProxy();
		}
		return this.#schemaProxy.obj;
	}
	get settings() {}
	get trained() {}
	get dataset() {}

}

// function saveSchema(e, schema) {
// 	var filePath = dialog.showSaveDialogSync({
// 		title: 'Сохранение расчётной схемы',
// 		defaultPath: __dirname + '/schemes/schema.json',
// 	});
// 	fs.writeFileSync(filePath, stringifySchema(schema));
// 	return filePath;
// }

// function runTrain(e, settings) {

// 	const child = fork(
// 		path.join(__dirname, 'training/index.js'),
// 		[JSON.stringify({schemaNum: 1, ...settings})]
// 	);

// 	child.on('message', mess => {
// 		console.log('test test test mess');
// 	})
// 	return 'train run!'; // this is a promise
// }
