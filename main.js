const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const { parseSchema } = require('./common');
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
}

function calcFem(e, schema) {
	return fem.calc(schema);
}

function calcNeyro(e, schemaNum) {
	const net = require(`./schemes/${schemaNum}/trained.js`);
	const schemaJson = fs.readFileSync(path.join(__dirname,`./schemes/${schemaNum}/schema.json`));
	const schema = require(`./schemes/${schemaNum}/trained.js`);
	return neyro.calc(net, schema);
}

function saveSchema(e, schema) {
	dialog.showSaveDialog({
		title: 'Сохранение расчётной схемы',
		defaultPath: __dirname + '/schemes/schema.json',
	})
		.then(responce => fs.writeFileSync(responce.filePath, JSON.stringify(schema)));
}

app.whenReady().then(() => {
	ipcMain.handle('fem', calcFem);
	ipcMain.handle('neyro', calcNeyro);
	ipcMain.handle('save', saveSchema);
	createWindow();
});

