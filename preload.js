const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
	create: () => ipcRenderer.invoke('create'),
	load: () => ipcRenderer.invoke('load'),
	sync: (schema, settings) => ipcRenderer.invoke('sync', schema, settings),
	save: () => ipcRenderer.invoke('save'),
	dataset: () => ipcRenderer.invoke('dataset', ),
	train: () => ipcRenderer.invoke('train', ),
	calc: (type) => ipcRenderer.invoke('calc', type),
});