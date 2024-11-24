import MockAdapter from 'axios-mock-adapter';
import { authenticate } from '../../services/authService';
import { GetUserAuthenticatedDto, ServiceResponse, UserLoginDto } from '../../interfaces/authTypes';

// Mock EnvironmentService to return a fixed base URL
jest.mock('../../services/EnvironmentService', () => ({
  EnvironmentService: {
    getApiBaseUrl: jest.fn(() => 'http://mockapi.com')
  }
}));

// Import the axios instance created in authService
import { api_Authenticate } from '../../services/authService';

describe('authService', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(api_Authenticate); // Use the imported axios instance
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  const loginData: UserLoginDto = {
    login: 'testuser',
    password: 'testpassword',
  };

  test('should authenticate user successfully', async () => {
    const mockResponse: ServiceResponse<GetUserAuthenticatedDto> = {
      data: {
        name: 'TestUser',
        language: 'EN',
        tokenAuth: {
          authenticated: true,
          created: '2024-01-01T00:00:00Z',
          expiration: '2024-01-01T01:00:00Z',
          accessToken: 'mockAccessToken',
          refreshToken: 'mockRefreshToken',
        },
      },
      success: true,
      message: 'Authenticated successfully',
      errors: [],
      unauthorized: false,
    };

    mock.onPost('/').reply(200, mockResponse);

    const data = await authenticate(loginData);

    expect(data).toEqual(mockResponse);
  });

  test('should handle authentication error with unauthorized message', async () => {
    const mockResponse: ServiceResponse<null> = {
      data: null,
      success: false,
      message: 'Unauthorized access',
      errors: [],
      unauthorized: true,
    };

    mock.onPost('/').reply(401, mockResponse);

    try {
      await authenticate(loginData);
    } catch (error) {
        expect(error).not.toBeNull();
    }
  });

  test('should handle server error', async () => {
    mock.onPost('/').reply(500);

    await expect(authenticate(loginData)).rejects.toThrow('Request failed with status code 500');
  });

  test('should handle authentication with error messages', async () => {
    const mockResponse: ServiceResponse<null> = {
      data: null,
      success: false,
      message: 'Validation failed',
      errors: [{ message: 'Invalid credentials' }],
      unauthorized: false,
    };

    mock.onPost('/').reply(400, mockResponse);

    try {
      await authenticate(loginData);
    } catch (error) {
      expect(error).not.toBeNull();
    }
  });
});