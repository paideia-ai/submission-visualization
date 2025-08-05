import type { SessionData } from '$lib/schemas';

interface DataStore {
  isCustomData: boolean;
  customData: SessionData | null;
  fileName: string | null;
}

let store = $state<DataStore>({
  isCustomData: false,
  customData: null,
  fileName: null
});

export function useDataStore() {
  return {
    get isCustomData() {
      return store.isCustomData;
    },
    get customData() {
      return store.customData;
    },
    get fileName() {
      return store.fileName;
    },
    setCustomData(data: SessionData, fileName: string) {
      store.isCustomData = true;
      store.customData = data;
      store.fileName = fileName;
    },
    resetToDefault() {
      store.isCustomData = false;
      store.customData = null;
      store.fileName = null;
    }
  };
}