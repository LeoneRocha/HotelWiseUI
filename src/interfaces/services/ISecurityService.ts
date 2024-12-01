// interfaces/ISecurityService.ts
export interface ISecurityService {
  isTokenValid(storageKey: string, token: string | null): boolean;
  isTokenExpired(storageKey: string, token: string): boolean;
  getToken(storageKey: string, token: string): string | null;
  setToken(storageKey: string, token: string): void;
  removeToken(storageKey: string, token: string): void;
  formatTimestamp(timestamp: number): string;
}
