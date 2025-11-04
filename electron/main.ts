import { app, BrowserWindow } from 'electron';
import path from 'path';
import { getPreloadPath } from './pathResolver.js';
import { isDev } from './util.js';

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: getPreloadPath(),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  if (isDev()) {
    // В режимі розробки підключаємось до dev-сервера UmiJS
    mainWindow.loadURL('http://localhost:8000');
    // Відкрити DevTools
    mainWindow.webContents.openDevTools();
  } else {
    // В production завантажуємо зібраний frontend
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist/index.html'));
  }

  mainWindow.on('closed', () => {
    // Очищення при закритті вікна
  });
});

// Вихід коли всі вікна закриті (крім macOS)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Створити вікно при активації на macOS
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    app.emit('ready');
  }
});
