//https://stackoverflow.com/questions/70440505/ts1343-the-import-meta-meta-property-is-only-allowed-when-the-module-opti
export class EnvironmentService {
    // Método para obter a versão da UI
    public static getUIVersion(): string {
      return process.env.VITE_UI_VERSION || '';
    } 

    public static getApiBaseUrl(): string {
        return process.env.VITE_API_BASE_URL || '';
      }
    
  }
  
 