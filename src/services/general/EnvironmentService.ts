// services/EnvironmentService.ts

import { IEnvironmentService } from "../../interfaces/services/IEnvironmentService";
class EnvironmentService implements IEnvironmentService {
  public getUIVersion(): string {
    const version = process.env.VITE_UI_VERSION?.trim();
    return version || '1.0';
  }

  public getApiBaseUrl(): string {
    const url = process.env.VITE_API_BASE_URL?.trim();
    return url || 'http://localhost:3000/api';
  }

  public isNotTestEnvironment(): boolean {
    return process.env.NODE_ENV !== 'test';
  }
}

export default new EnvironmentService();
