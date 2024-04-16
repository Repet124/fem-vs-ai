const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
	fem: (schema) => ipcRenderer.invoke('fem', schema),
	neyro: (schema) => ipcRenderer.invoke('neyro', schema),
	save: (schema) => ipcRenderer.invoke('save', schema),
});