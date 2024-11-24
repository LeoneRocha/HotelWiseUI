import { EnvironmentService } from '../../services/EnvironmentService';

describe('EnvironmentService', () => {

  beforeEach(() => {
    // Limpa variáveis de ambiente antes de cada teste
    delete process.env.VITE_UI_VERSION;
    delete process.env.VITE_API_BASE_URL;
  });

  test('should return default UI version if VITE_UI_VERSION is not set', () => {
    const uiVersion = EnvironmentService.getUIVersion();
    expect(uiVersion).toBe('1.0');
  });

  test('should return UI version from environment variable', () => {
    process.env.VITE_UI_VERSION = '2.1';
    const uiVersion = EnvironmentService.getUIVersion();
    expect(uiVersion).toBe('2.1');
  });

  test('should return default API base URL if VITE_API_BASE_URL is not set', () => {
    const apiBaseUrl = EnvironmentService.getApiBaseUrl();
    expect(apiBaseUrl).toBe('http://localhost:3000/api');
  });

  test('should return API base URL from environment variable', () => {
    process.env.VITE_API_BASE_URL = 'https://api.example.com';
    const apiBaseUrl = EnvironmentService.getApiBaseUrl();
    expect(apiBaseUrl).toBe('https://api.example.com');
  });
});
