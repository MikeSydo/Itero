const electron = require('electron');

// Експозиція API для renderer процесу
electron.contextBridge.exposeInMainWorld('electron', {
    // Тут можна додати методи для комунікації з main process
    // Наприклад, для роботи з файловою системою, нотифікаціями тощо
    
    // Приклад: отримання статистики
    getStaticData: () => {
        console.log('Getting static data from main process');
        return { version: electron.app?.getVersion() || 'unknown' };
    },
    
    // Приклад: підписка на події
    subscribeStatistics: (callback: (statistics: any) => void) => {
        // Тут можна підписатися на IPC події
        callback({ message: 'Statistics data' });
    },
});
