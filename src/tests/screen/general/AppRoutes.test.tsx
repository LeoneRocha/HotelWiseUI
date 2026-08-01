import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import AppRoutes from '../../../routes';

vi.mock('../../../components/general/UserProfile', () => ({
  default: () => <div>UserProfile</div>,
}));

vi.mock('../../../components/general/PrivacyPolicy', () => ({
  default: () => <div>PrivacyPolicy</div>,
}));

vi.mock('../../../components/general/Callback', () => ({
  default: () => <div>Callback</div>,
}));

describe('AppRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => { });
  });

  test('should render Login component at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('should render Login component at /login alias', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
  });

  test('should render PrivacyPolicy before catch-all', () => {
    render(
      <MemoryRouter initialEntries={['/privacy-policy']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText('PrivacyPolicy')).toBeInTheDocument();
  });

  test('should render Callback before catch-all', () => {
    render(
      <MemoryRouter initialEntries={['/callback']}>
        <AppRoutes />
      </MemoryRouter>
    );

    expect(screen.getByText('Callback')).toBeInTheDocument();
  });
});
