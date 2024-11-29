// services/EnvironmentService.ts

import { IEnvironmentService } from "../interfaces/services/IEnvironmentService";
class EnvironmentService implements IEnvironmentService {
  public getUIVersion(): string {
    return process.env.VITE_UI_VERSION ?? '1.0';
  }

  public getApiBaseUrl(): string {
    return process.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api';
  }

  public isNotTestEnvironment(): boolean {
    return process.env.NODE_ENV !== 'test';
  }
}

export default new EnvironmentService();
