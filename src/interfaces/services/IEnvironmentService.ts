// interfaces/IEnvironmentService.ts
export interface IEnvironmentService {
    getUIVersion(): string;
    getApiBaseUrl(): string;
    isNotTestEnvironment(): boolean;
  }
  