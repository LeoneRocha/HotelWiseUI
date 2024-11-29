// interfaces/ISecurityService.ts
export interface ISecurityService {
  isTokenValid(token: string | null): boolean;
  isTokenExpired(token: string): boolean;
  getToken(): string | null;
  setToken(token: string): void;
  removeToken(): void;
  formatTimestamp(timestamp: number): string;
}
