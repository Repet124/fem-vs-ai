const path = require('node:path');
const fs = require('fs');
const dotenv = require('dotenv');
const { fork } = require('node:child_process');

const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { parseSchema, stringifySchema } = require('./common');

const fem = require('./resolvers/fem');
const neyro = require('./resolvers/neyro');
const train = require('./training/trainer');
dotenv.config()

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1920,
		height: 1080,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		}
	})

	win.loadFile('./public/index.html')
	return win;
}

function calcFem(e, schema) {
	return fem.calc(schema);
}

function calcNeyro(e, schema, schemaPath) {
	// const net = require(schemaPath.replace('schema.json', 'trained.js'));
	return neyro.calc(
		JSON.parse(fs.readFileSync(schemaPath.replace('schema.json', 'trained.json'))),
		schema
	);
}

function loadSchema(e) {
	var file = dialog.showOpenDialogSync({
		title: 'Загрузить расчётную схему',
		defaultPath: __dirname + '/schemes',
		properties: ['openFile']
	})[0];
	if (file && /.*\.json/.test(file)) {
		return {
			schema: parseSchema(fs.readFileSync(file)),
			path: file,
		};
	}
	return false;
}

function saveSchema(e, schema) {
	var filePath = dialog.showSaveDialogSync({
		title: 'Сохранение расчётной схемы',
		defaultPath: __dirname + '/schemes/schema.json',
	});
	fs.writeFileSync(filePath, stringifySchema(schema));
	return filePath;
}

function runTrain(e, schemaNum, batch, ages, limit) {

	const child = fork(
		path.join(__dirname, 'training/index.js'),
		[JSON.stringify({schemaNum, batch, ages, limit})]
	);

	child.on('message', mess => {
		console.log('test test test mess');
	})
	return 'train run!'; // this is a promise
}

app.whenReady().then(() => {
	createWindow();
	ipcMain.handle('fem', calcFem);
	ipcMain.handle('neyro', calcNeyro);
	ipcMain.handle('train', runTrain);
	ipcMain.handle('load', loadSchema);
	ipcMain.handle('save', saveSchema);
});

