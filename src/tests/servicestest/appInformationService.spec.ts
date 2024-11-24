
import MockAdapter from 'axios-mock-adapter';
import { getAppInformationVersionProduct } from '../../services/appInformationService';
import { IAppInformation } from '../../interfaces/IAppInformation'; 

// Mock EnvironmentService to return a fixed base URL
jest.mock('../../services/EnvironmentService', () => ({
  EnvironmentService: {
    getApiBaseUrl: jest.fn(() => 'http://mockapi.com')
  }
}));

// Import the axios instance created in appInformationService
import { api_appInformationService } from '../../services/appInformationService';

describe('appInformationService', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(api_appInformationService); // Use the imported axios instance
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  test('should fetch app information version product', async () => {
    const mockData: IAppInformation[] = [
      { id: '1', version: '1.0', name: 'Product 1', environmentName: '', message: '' },
      { id: '2', version: '2.0', name: 'Product 2', environmentName: '', message: '' },
    ];

    mock.onGet('/GetAppInformationVersionProduct').reply(200, mockData);

    const data = await getAppInformationVersionProduct();

    expect(data).toEqual(mockData);
  });

  test('should handle error', async () => {
    mock.onGet('/GetAppInformationVersionProduct').reply(404);

    await expect(getAppInformationVersionProduct()).rejects.toThrow('Request failed with status code 404');
  });
});
