const { app, BrowserWindow, ipcMain } = require('electron')
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

function calcNeyro(e, schema) {
	return neyro.calc(schema);
}

app.whenReady().then(() => {
	ipcMain.handle('fem', calcFem)
	ipcMain.handle('neyro', calcNeyro)
	createWindow()
})