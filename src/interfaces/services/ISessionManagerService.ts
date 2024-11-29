// interfaces/ISessionManager.ts
export interface ISessionManagerService {
  saveToSession<T>(key: string, value: T): void;
  getFromSession<T>(key: string): T | null;
  removeFromSession(key: string): void;
}
