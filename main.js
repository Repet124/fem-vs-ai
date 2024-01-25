const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('node:path');

const createWindow = () => {
	const win = new BrowserWindow({
		width: 1000,
		height: 800,
		webPreferences: {
			preload: path.join(__dirname, 'preload.js'),
		}
	})

	win.loadFile('index.html')
}

app.whenReady().then(() => {
	ipcMain.handle('ping', () => 'pong')
	createWindow()
})