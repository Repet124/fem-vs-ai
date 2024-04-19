const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { parseSchema, stringifySchema } = require('./common');
const fs = require('fs');
const path = require('node:path');
const fem = require('./resolvers/fem');
const neyro = require('./resolvers/neyro');
const dotenv = require('dotenv');
dotenv.config()

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1400,
		height: 800,
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
	const net = require(schemaPath.replace('schema.json', 'trained.js'));
	return neyro.calc(net, schema);
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

app.whenReady().then(() => {
	createWindow();
	ipcMain.handle('fem', calcFem);
	ipcMain.handle('neyro', calcNeyro);
	ipcMain.handle('load', loadSchema);
	ipcMain.handle('save', saveSchema);
});

