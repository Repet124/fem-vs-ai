const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
	send: (schema) => ipcRenderer.invoke('send', schema)
	// we can also expose variables, not just functions
})