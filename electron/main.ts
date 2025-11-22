import { app, BrowserWindow } from 'electron';
import path from 'path';
import { isDev } from './util.js';

const PORT = process.env.CLIENT_PORT || 3001;
const URL = `http://localhost:${PORT}`;

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });
  if (isDev()) {
    mainWindow.loadURL(URL);
    //mainWindow.loadFile('electron/test.html');
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), 'dist/index.html'));
    //mainWindow.loadFile('electron/test.html');
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
