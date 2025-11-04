// Типи для Electron API, доступні через preload script

export interface ElectronAPI {
  getStaticData: () => { version: string };
  subscribeStatistics: (callback: (statistics: any) => void) => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
