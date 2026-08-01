import { type Mock } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import AuthGuard from '../../../components/general/AuthGuard';
import LocalStorageService from '../../../services/general/localStorageService';
import SecurityService from '../../../services/general/securityService';

vi.mock('../../../services/general/localStorageService', async () => ({
  default: {
    getItem: vi.fn(),
  },
}));
vi.mock('../../../services/general/securityService', async () => ({
  default: {
    isTokenExpired: vi.fn(),
  },
}));

describe('AuthGuard component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => { });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('renders children when token is valid', () => {
    (LocalStorageService.getItem as Mock).mockReturnValue('valid-token');
    (SecurityService.isTokenExpired as Mock).mockReturnValue(false);

    const { getByText } = render(
      <MemoryRouter initialEntries={['/tabs/9']}>
        <Routes>
          <Route path="/tabs/:id" element={<AuthGuard><div>Protected Content</div></AuthGuard>} />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to Login when token is expired', () => {
    (LocalStorageService.getItem as Mock).mockReturnValue('expired-token');
    (SecurityService.isTokenExpired as Mock).mockReturnValue(true);

    const { getByText } = render(
      <MemoryRouter initialEntries={['/tabs/9']}>
        <Routes>
          <Route path="/tabs/:id" element={<AuthGuard><div>Protected Content</div></AuthGuard>} />
          <Route path="/Login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Login Page')).toBeInTheDocument();
  });

  test('redirects to Login when token is not present', () => {
    (LocalStorageService.getItem as Mock).mockReturnValue(null);

    const { getByText } = render(
      <MemoryRouter initialEntries={['/tabs/9']}>
        <Routes>
          <Route path="/tabs/:id" element={<AuthGuard><div>Protected Content</div></AuthGuard>} />
          <Route path="/Login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(getByText('Login Page')).toBeInTheDocument();
  });
});
