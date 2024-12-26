// AzureAuthService.ts 
import { PublicClientApplication, AuthenticationResult, AccountInfo } from '@azure/msal-browser';
import LocalStorageService from './localStorageService';
import { loginApiRequest, msalConfig, nameStorageTokenAzureAD } from '../auth-config';

class AzureAuthService {
  private readonly msalInstance: PublicClientApplication;

  constructor() {
    this.msalInstance = new PublicClientApplication(msalConfig);
  }

  public async initialize(): Promise<void> {
    await this.msalInstance.initialize();
  }

  public getAccounts(): AccountInfo[] {
    return this.msalInstance.getAllAccounts();
  }

  public async getTokenAccess(): Promise<string> {
    // Verifica se a instância foi inicializada
    await this.initialize();

    const responseTokenStorage = LocalStorageService.getItem(nameStorageTokenAzureAD);
    if (responseTokenStorage == null) {
      const accounts = this.getAccounts();
      if (accounts.length === 0) {
        throw new Error('Nenhuma conta encontrada.');
      }

      const account = accounts[0];
      const msalResponse: AuthenticationResult = await this.msalInstance.acquireTokenSilent({
        ...loginApiRequest,
        account: account,
      });

      const responseToken = `${msalResponse.accessToken}`;
      console.log("Recuperou o token do azure");      
      LocalStorageService.setItem(nameStorageTokenAzureAD, responseToken);
      return responseToken;
    } else {
      console.log("Uso o token do storage");
      return responseTokenStorage;
    }
  }

  public logout(): void {
    this.msalInstance.logoutRedirect({
      onRedirectNavigate: () => {
        LocalStorageService.removeItem(nameStorageTokenAzureAD);
        return true;
      }
    });
  }
}

export default new AzureAuthService();
