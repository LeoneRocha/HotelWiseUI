// interfaces/ILocalStorageService.ts
export interface ILocalStorageService {
  setItem(key: string, value: string): void;
  getItem(key: string): string | null;
  removeItem(key: string): void;
  hasItem(key: string): boolean;
  clear(): void;
}
