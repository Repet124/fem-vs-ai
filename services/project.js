var fs = require('fs');
var { parseSchema, stringifySchema } = require('./common');

module.exports = class Project {

	#filePath;
	#schema;
	#settings;
	#trained;
	#dataset;

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

	load(filePath) {
		this.filePath = filePath;
		return this.parse();
	}

	save() {}
	toFrontend() {}

	set filePath() {}
	set schema() {}
	set settings() {}
	set trained() {}
	set dataset() {}

	get filePath() {}
	get schema() {}
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
