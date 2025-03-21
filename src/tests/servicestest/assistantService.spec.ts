import MockAdapter from 'axios-mock-adapter';
import { IAskAssistantResponse } from '../../interfaces/IAskAssistantResponse';
// Mock EnvironmentService to return a fixed base URL
jest.mock('../../services/EnvironmentService', () => ({
  __esModule: true,
  default: {
    getApiBaseUrl: jest.fn(() => 'http://mockapi.com')
  }
}));

// Import the axios instance created in assistantService
import AssistantService from '../../services/assistantService';
import { api_assistantService } from '../../services/assistantService';

describe('assistantService', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(api_assistantService); // Use the imported axios instance
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  const criteria = { 
    message: 'example search text',
  };

  test('should get chat completion successfully', async () => {
    const mockData: IAskAssistantResponse[] = [
      { message: 'This is a mock response from the assistant.' }
    ];

    mock.onPost('/').reply(200, mockData);

    const data = await AssistantService.getChatCompletion(criteria);

    expect(data).toEqual(mockData);
  });

  test('should handle error', async () => {
    mock.onPost('/').reply(500);

    await expect(AssistantService.getChatCompletion(criteria)).rejects.toThrow('Request failed with status code 500');
  });
});
