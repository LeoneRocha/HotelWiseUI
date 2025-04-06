// services/LocalStorageService.ts 

import { ILocalStorageService } from "../../interfaces/services/ILocalStorageService";

class LocalStorageService implements ILocalStorageService {
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  hasItem(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  clear(): void {
    localStorage.clear();
  }
}

export default new LocalStorageService();
