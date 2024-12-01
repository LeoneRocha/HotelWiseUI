// services/AzureAuthService.ts
import axios from 'axios';
import { PublicClientApplication, AuthenticationResult, AccountInfo } from '@azure/msal-browser';
import LocalStorageService from './localStorageService';
import { loginApiRequest, msalConfig } from '../auth-config';

class AzureAuthService {
  private msalInstance: PublicClientApplication;

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

    const responseTokenStorage = LocalStorageService.getItem('Authorization_Token');
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

      const responseToken = `Bearer ${msalResponse.accessToken}`;
      console.log("Recuperou o token do azure");

      axios.defaults.headers.common['Authorization'] = responseToken;

      LocalStorageService.setItem('Authorization_Token', responseToken);

      return responseToken;
    } else {
      console.log("Uso o token do storage");
      return responseTokenStorage;
    }
  }

  public logout(): void {
    this.msalInstance.logoutRedirect({
      onRedirectNavigate: () => {
        LocalStorageService.removeItem('azureAccessToken');
        return true;
      }
    });
  }
}

export default new AzureAuthService();