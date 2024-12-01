// interfaces/services/IAzureAuthService.ts
export interface IAzureAuthService {
  getAccounts(): object[];
  acquireTokenSilent(scopes: string[]): Promise<string>;
  logout(): void;
}

// interfaces/IAccountInfo.ts
export interface IAccountInfo {
  name?: string;
  username?: string;
  localAccountId?: string;
  idTokenClaims?: IDTokenClaims;
}
// interfaces/IDTokenClaims.ts
export interface IDTokenClaims {
  [key: string]: unknown;
}
