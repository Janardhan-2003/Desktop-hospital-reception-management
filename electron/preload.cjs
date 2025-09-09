const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  checkExcelExists: () => ipcRenderer.invoke('excel:exists'),
  initializeExcelFile: () => ipcRenderer.invoke('excel:init'),
  readPatients: () => ipcRenderer.invoke('excel:read'),
  writePatient: (patient) => ipcRenderer.invoke('excel:write', patient),
  exportToExcel: (patients, filename) => ipcRenderer.invoke('excel:export', patients, filename),
});

