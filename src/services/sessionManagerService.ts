// services/sessionManager.ts

import { ISessionManagerService } from "../interfaces/services/ISessionManagerService";

class SessionManagerService implements ISessionManagerService {
  saveToSession<T>(key: string, value: T): void {
    sessionStorage.setItem(key, JSON.stringify(value));
  }

  getFromSession<T>(key: string): T | null {
    const item = sessionStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  }

  removeFromSession(key: string): void {
    sessionStorage.removeItem(key);
  }
}

export default new SessionManagerService();
