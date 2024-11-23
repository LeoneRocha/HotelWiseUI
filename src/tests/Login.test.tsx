import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Login from '../components/Login'; // Ajuste o caminho conforme necessário
import { authenticate } from '../services/authService';
import SecurityService from '../services/securityService';
import LocalStorageService from '../services/localStorageService';

// Mock do arquivo CSS para evitar problemas durante o teste
jest.mock('../css/Login.css', () => ({}));

// Mock dos serviços
jest.mock('../services/authService', () => ({
  authenticate: jest.fn(),
}));
jest.mock('../services/securityService', () => ({
  getToken: jest.fn(),
  isTokenValid: jest.fn(),
  setToken: jest.fn(),
}));
jest.mock('../services/localStorageService', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

describe('Login component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
     // Mock do console.warn para suprimir os avisos durante os testes
     jest.spyOn(console, 'warn').mockImplementation(() => { });
  });

  test('renders login form and handles login successfully', async () => {
    (authenticate as jest.Mock).mockResolvedValue({
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
      expect(authenticate).toHaveBeenCalledWith({ login: 'testUser', password: 'testPassword' });
    });

    // Verifica se o token foi definido e o redirecionamento ocorreu
    await waitFor(() => {
      expect(SecurityService.setToken).toHaveBeenCalledWith('mockToken');
      expect(mockNavigate).toHaveBeenCalledWith('/search');
    });
  });

  test('displays error message on login failure', async () => {
    (authenticate as jest.Mock).mockResolvedValue({
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
    (LocalStorageService.getItem as jest.Mock).mockReturnValue('rememberedUser');

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
    (SecurityService.getToken as jest.Mock).mockReturnValue('validToken');
    (SecurityService.isTokenValid as jest.Mock).mockReturnValue(true);

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Verifica se ocorreu o redirecionamento para a página de busca
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/search');
    });
  });
});
