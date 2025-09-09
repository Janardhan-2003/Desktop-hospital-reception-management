import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initializeExcelFile,
  checkExcelFileExists,
  readPatientsFromExcel,
  writePatientToExcel,
  exportToExcel,
} from '../src/utils/excelHandler.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow = null;

// Check if running in dev mode
const isDev = process.env.VITE_DEV_SERVER_URL;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.cjs'),
    },
  });

  if (isDev) {
    // Dev: use Vite dev server
    await mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools({ mode: 'detach' });
  } else {
    // Prod: load the built React app (now in dist-react)
    const indexPath = path.join(__dirname, '../dist-react/index.html');
    await mainWindow.loadFile(indexPath);
  }
}

// IPC handlers for Excel operations with debug logging
ipcMain.handle('excel:exists', async () => {
  console.log('IPC: Checking if Excel exists...');
  const result = await checkExcelFileExists();
  console.log('IPC: Excel exists result:', result);
  return result;
});

ipcMain.handle('excel:init', async () => {
  console.log('IPC: Initializing Excel file...');
  const result = await initializeExcelFile();
  console.log('IPC: Excel init result:', result);
  return result;
});

ipcMain.handle('excel:read', async () => {
  console.log('IPC: Reading patients from Excel...');
  const result = await readPatientsFromExcel();
  console.log('IPC: Read patients result:', result.length, 'patients');
  return result;
});

ipcMain.handle('excel:write', async (_event, patient) => {
  console.log('IPC: ===== WRITE PATIENT IPC HANDLER =====');
  console.log('IPC: Received patient data:', patient);
  
  try {
    const result = await writePatientToExcel(patient);
    console.log('IPC: Write result:', result);
    return result;
  } catch (error) {
    console.error('IPC: Error in write handler:', error.message);
    console.error('IPC: Error stack:', error.stack);
    return false;
  }
});

ipcMain.handle('excel:export', async (_event, patients, filename) => {
  console.log('IPC: Exporting', patients.length, 'patients to Excel...');
  const result = await exportToExcel(patients, filename);
  console.log('IPC: Export result:', result);
  return result;
});

app.whenReady().then(() => {
  console.log('APP: Electron app ready, creating window...');
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});       