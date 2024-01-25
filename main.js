const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path');
const mathjs = require('mathjs')

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

function handleSendSchema(e, schema) {
	console.log(schema)
	return {test: 123};
}

app.whenReady().then(() => {
	ipcMain.handle('send', handleSendSchema)
	createWindow()
})