import { app, BrowserWindow } from 'electron';
import path from 'path';
import { getPreloadPath } from './pathResolver.js';
import { isDev } from './util.js';

const PORT = process.env.CLIENT_PORT || 3003;
const URL = `http://localhost:${PORT}`;

app.on('ready', () => {
  const mainWindow = new BrowserWindow({
    webPreferences: {
      preload: getPreloadPath(),
    },
  });
  if (isDev()) {
    mainWindow.loadURL(URL);
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
  }
});
