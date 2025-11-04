# Electron Integration Guide

## Структура Electron

```
itero/electron/
├── main.ts           # Головний процес Electron
├── preload.cts       # Preload script (Context Bridge)
├── util.ts           # Утилітарні функції
├── pathResolver.ts   # Резолвинг шляхів
├── types.d.ts        # TypeScript типи для Electron API
└── tsconfig.json     # TypeScript конфігурація
```

## Як це працює

### 1. Main Process (main.ts)

Головний процес Electron створює BrowserWindow і керує життєвим циклом додатку.

**Development mode:**
- Підключається до UmiJS dev server (`http://localhost:8000`)
- Відкриває DevTools автоматично

**Production mode:**
- Завантажує зібраний `dist/index.html`

### 2. Preload Script (preload.cts)

Використовує Context Bridge для безпечного експонування API в renderer процес:

```typescript
electron.contextBridge.exposeInMainWorld('electron', {
  getStaticData: () => { ... },
  subscribeStatistics: (callback) => { ... }
});
```

### 3. Renderer Process (React/UmiJS)

Доступ до Electron API через `window.electron`:

```typescript
// В React компонентах
const data = window.electron.getStaticData();
```

## Робочий процес

### Режим розробки

1. Запустити: `npm run dev:electron`
2. Це виконає:
   - Транспіляцію Electron TypeScript файлів
   - Запуск UmiJS dev server (:8000)
   - Запуск API server (:3001)
   - Запуск Electron з вікном

### Збірка для production

1. Збудувати frontend: `npm run build`
2. Збудувати backend: `npm run api:build`
3. Транспілювати Electron: `npm run electron:transpile`
4. Зібрати desktop app: `npm run electron:dist:win` (або mac/linux)

Або все разом: `npm run build:electron`

## Конфігурація збірки

Файл `electron-builder.json` визначає:
- Які файли включати в збірку
- Налаштування для кожної платформи
- Іконки, ідентифікатори тощо

```json
{
  "appId": "com.mikesydo.itero",
  "productName": "Itero",
  "files": ["dist-electron", "dist"],
  ...
}
```

## Додавання нових Electron API

### 1. Додати функцію в main.ts

```typescript
// В main.ts
ipcMain.handle('get-user-data', async () => {
  return { name: 'User', id: 123 };
});
```

### 2. Експонувати в preload.cts

```typescript
// В preload.cts
electron.contextBridge.exposeInMainWorld('electron', {
  getUserData: () => electron.ipcRenderer.invoke('get-user-data')
});
```

### 3. Додати тип в types.d.ts

```typescript
// В types.d.ts
export interface ElectronAPI {
  getUserData: () => Promise<{ name: string; id: number }>;
}
```

### 4. Використати в React

```typescript
// В компоненті
const userData = await window.electron.getUserData();
```

## Безпека

- ✅ `nodeIntegration: false` - відключено Node.js в renderer
- ✅ `contextIsolation: true` - ізоляція контексту
- ✅ Preload script - безпечний bridge між процесами
- ✅ Валідація всіх IPC повідомлень

## Платформо-специфічні особливості

### Windows
- Формати: NSIS installer, Portable EXE
- Іконка: `build/icon.ico`

### macOS
- Формат: DMG
- Підтримка: Intel (x64) і Apple Silicon (arm64)
- Іконка: `build/icon.icns`

### Linux
- Формати: AppImage, DEB
- Категорія: Utility
- Іконка: `build/icon.png`

## Debugging

### Electron Main Process
```bash
# Запустити з debug
npm run electron:transpile
electron --inspect=5858 .
```

### Renderer Process
- DevTools відкриваються автоматично в dev mode
- Або: `mainWindow.webContents.openDevTools()`

## Корисні команди

```bash
# Перевірка Electron
npm run electron:transpile
electron .

# Очистити кеш
rm -rf dist-electron node_modules/.cache

# Перевірити розмір збірки
npm run build:electron
du -sh dist/
```

## Проблеми та рішення

### Electron не відкривається
1. Перевірте чи скомпільовані TS файли: `npm run electron:transpile`
2. Перевірте логи в терміналі
3. Перевірте чи запущений dev server

### "Cannot find module" помилка
- Виконайте `npm install`
- Очистіть `dist-electron` і перекомпілюйте

### Біла сторінка в Electron
1. Переконайтеся що dev server запущений на :8000
2. Перевірте `main.ts` URL
3. Відкрийте DevTools і перевірте консоль

### Помилки збірки
- Перевірте `electron-builder.json`
- Переконайтеся що всі файли в `dist/` та `dist-electron/`
- Перевірте наявність іконок в `build/`

## Ресурси

- [Electron Docs](https://www.electronjs.org/docs)
- [Electron Builder](https://www.electron.build)
- [Security Best Practices](https://www.electronjs.org/docs/tutorial/security)
- [IPC Communication](https://www.electronjs.org/docs/latest/tutorial/ipc)
