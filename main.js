const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path');
const fem = require('./fem');

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1400,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		}
	})

	win.loadFile('index.html')
}

function calcSchema(e, schema) {
	return fem.calc(schema);
}

app.whenReady().then(() => {
	ipcMain.handle('send', calcSchema)
	createWindow()
})