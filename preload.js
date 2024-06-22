const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
	fem: (schema) => ipcRenderer.invoke('fem', schema),
	neyro: (schema, schemaPath) => ipcRenderer.invoke('neyro', schema, schemaPath),
	train: (schemaNum, batch, ages, limit) => ipcRenderer.invoke('train', schemaNum, batch, ages, limit),
	load: (schema) => ipcRenderer.invoke('load', schema),
	save: (schema) => ipcRenderer.invoke('save', schema),
});