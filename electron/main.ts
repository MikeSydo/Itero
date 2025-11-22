import { app, BrowserWindow } from 'electron';
import path from 'path';
import { getPreloadPath } from './pathResolver.js';
import { isDev } from './util.js';

const PORT = process.env.CLIENT_PORT || 3001;
const URL = `http://localhost:${PORT}`;

async function waitForServer(url: string, maxRetries = 30): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status === 404) {
        return true;
      }
    } catch (error) {
      // Server not ready yet, wait and retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return false;
}

app.on('ready', async () => {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: getPreloadPath(),
    },
  });

  if (isDev()) {
    console.log('Waiting for development server...');
    const serverReady = await waitForServer(URL);
    if (serverReady) {
      console.log('Development server is ready, loading URL:', URL);
      mainWindow.loadURL(URL);
    } else {
      console.error('Development server failed to start');
    }
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), '/dist-react/index.html'));
  }
});
