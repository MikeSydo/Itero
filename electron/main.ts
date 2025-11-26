import { app, BrowserWindow, protocol, net } from 'electron';
import path from 'path';
import { isDev } from './util.js';

const PORT = process.env.CLIENT_PORT || 3001;
const URL = `http://localhost:${PORT}`;

protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      standard: true,
      secure: true,
      supportFetchAPI: true,
      corsEnabled: true,
      bypassCSP: true,
      stream: true,
      allowServiceWorkers: true,
    }
  }
]);

async function waitForServer(url: string, maxRetries = 30): Promise<boolean> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status === 404) {
        return true;
      }
    } catch (error) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  return false;
}

app.whenReady().then(async () => {
  if (!isDev()) {
    protocol.handle('app', (request) => {
      const url = request.url.slice('app://'.length);
      const filePath = path.normalize(path.join(__dirname, '..', 'dist', url));
      return net.fetch(`file:///${filePath}`);
    });
  }

  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
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
    mainWindow.loadURL('app://./index.html');
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
