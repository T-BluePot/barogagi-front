declare global {
  interface Window {
    BarogagiApp?: {
      getData(name: string): Promise<string | null>;
      saveData(name: string, value: string): void;
      deleteData(name: string): void;
    };
  }
}

const bridgeStorage = {
  getItem: (name: string) =>
    window.BarogagiApp?.getData(name) ?? Promise.resolve(null),
  setItem: (name: string, value: string) =>
    Promise.resolve(window.BarogagiApp?.saveData(name, value)),
  removeItem: (name: string) =>
    Promise.resolve(window.BarogagiApp?.deleteData(name)),
};

export default bridgeStorage;

const sessionStorageAdapter = {
  getItem: (name: string) => Promise.resolve(sessionStorage.getItem(name)),
  setItem: (name: string, value: string) =>
    Promise.resolve(sessionStorage.setItem(name, value)),
  removeItem: (name: string) =>
    Promise.resolve(sessionStorage.removeItem(name)),
};

export const getPersistStorage = () =>
  window.BarogagiApp ? bridgeStorage : sessionStorageAdapter;
