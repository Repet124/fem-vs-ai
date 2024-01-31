const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('api', {
	fem: (schema) => ipcRenderer.invoke('fem', schema)
	// we can also expose variables, not just functions
})