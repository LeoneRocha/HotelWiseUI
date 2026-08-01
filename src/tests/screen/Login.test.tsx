import { type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { useNavigate } from 'react-router'; 
import AuthenticateService from '../../services/authService';
import SecurityService from '../../services/general/securityService';
import LocalStorageService from '../../services/general/localStorageService';
import Login from '../../components/general/Login';

// Mock do arquivo CSS para evitar problemas durante o teste
vi.mock('../../../css/Login.css', async () => ({}));

// Mock dos serviços
vi.mock('../../services/authService', async () => ({
  default: {
  authenticate: vi.fn(),
  },
}));
vi.mock('../../services/general/securityService', async () => ({
  default: {
  getToken: vi.fn(),
  isTokenValid: vi.fn(),
  setToken: vi.fn(),
  },
}));
vi.mock('../../services/general/localStorageService', async () => ({
  default: {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  },
}));

vi.mock('react-router', async () => ({
  ...await vi.importActual('react-router'),
  useNavigate: vi.fn(),
}));

describe('Login component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useNavigate as Mock).mockReturnValue(mockNavigate);
    // Mock do console.warn para suprimir os avisos durante os testes
    vi.spyOn(console, 'warn').mockImplementation(() => { });
  });

  test('renders login form and handles login successfully', async () => {
    (AuthenticateService.authenticate as Mock).mockResolvedValue({
      success: true,
      data: { tokenAuth: { accessToken: 'mockToken' } },
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Preenche os campos de login
    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'testPassword' } });

    // Submete o formulário de login
    fireEvent.click(screen.getAllByRole('button', { name: /entrar/i })[0]);

    // Verifica se a função authenticate foi chamada com os valores sanitizados
    await waitFor(() => {
      expect(AuthenticateService.authenticate).toHaveBeenCalledWith({ login: 'testUser', password: 'testPassword' });
    });

    // Verifica se o token foi definido e o redirecionamento ocorreu
    await waitFor(() => {
      expect(SecurityService.setToken).toHaveBeenCalledWith('token', 'mockToken');
      expect(mockNavigate).toHaveBeenCalledWith('/search', { replace: true });
    });
  });

  test('redirects to return path from location state after login', async () => {
    (AuthenticateService.authenticate as Mock).mockResolvedValue({
      success: true,
      data: { tokenAuth: { accessToken: 'mockToken' } },
    });

    render(
      <MemoryRouter initialEntries={[{ pathname: '/Login', state: { from: { pathname: '/tabs/9' } } }]}>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'testPassword' } });
    fireEvent.click(screen.getAllByRole('button', { name: /entrar/i })[0]);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/tabs/9', { replace: true });
    });
  });

  test('displays error message on login failure', async () => {
    (AuthenticateService.authenticate as Mock).mockResolvedValue({
      success: false,
      data: {},
    });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Preenche os campos de login
    fireEvent.change(screen.getByLabelText(/usuário/i), { target: { value: 'testUser' } });
    fireEvent.change(screen.getByLabelText(/senha/i), { target: { value: 'testPassword' } });

    // Submete o formulário de login
    fireEvent.click(screen.getAllByRole('button', { name: /entrar/i })[0]);

    // Verifica se a mensagem de erro foi exibida
    await waitFor(() => {
      expect(screen.getByText('Autenticação falhou. Por favor, verifique suas credenciais.')).toBeInTheDocument();
    });
  });

  test('loads remembered username on mount', async () => {
    (LocalStorageService.getItem as Mock).mockReturnValue('rememberedUser');

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Verifica se o nome de usuário lembrado foi carregado
    await waitFor(() => {
      expect(screen.getByDisplayValue('rememberedUser')).toBeInTheDocument();
    });
  });

  test('redirects to search if token is valid', async () => {
    (SecurityService.getToken as Mock).mockReturnValue('validToken');
    (SecurityService.isTokenValid as Mock).mockReturnValue(true);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Verifica se ocorreu o redirecionamento para a página de busca
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/search', { replace: true });
    });
  });
});
