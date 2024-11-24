
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Ajuste o caminho conforme necessário
import { getChatCompletion } from '../services/chatService';
import LocalStorageService from '../services/localStorageService';

// Mock do arquivo CSS para evitar problemas durante o teste
jest.mock('../css/Navbar.css', () => ({}));

// Mock dos serviços
jest.mock('../services/chatService', () => ({
  getChatCompletion: jest.fn(),
}));
jest.mock('../services/localStorageService', () => ({
  removeItem: jest.fn(),
}));

// Mock do `useNavigate`
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Suprimir logs de erro no console
beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

describe('Navbar component', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock do console.warn para suprimir os avisos durante os testes
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  test('renders navbar and handles search query', async () => {
    (getChatCompletion as jest.Mock).mockResolvedValue([{ response: 'Resposta do Assistente' }]);

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Preenche o campo de pesquisa e submete o formulário
    fireEvent.change(screen.getByPlaceholderText('Pergunte ao Assistente...'), { target: { value: 'teste' } });
    fireEvent.submit(screen.getByRole('button', { name: /enviar/i }));

    // Verifica se a função getChatCompletion foi chamada com a query correta
    await waitFor(() => {
      expect(getChatCompletion).toHaveBeenCalledWith({ maxHotelRetrieve: 0, searchTextCriteria: 'teste' });
    });

    // Verifica se a resposta é exibida no modal
    await waitFor(() => {
      const modalBody = screen.getByRole('dialog').querySelector('.modal-body');
      expect(modalBody).toHaveTextContent('Resposta do Assistente');
    });
  });

  test('handles logout', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Clica no botão de logout
    fireEvent.click(screen.getByTitle('Logout'));

    // Verifica se o modal de logout é exibido
    await waitFor(() => {
      expect(screen.getByText('Confirmar Logout')).toBeInTheDocument();
    });

    // Confirma o logout
    const logoutButtons = screen.getAllByRole('button', { name: /logout/i });
    fireEvent.click(logoutButtons[logoutButtons.length - 1]);

    // Verifica se a função removeItem foi chamada e o usuário foi redirecionado
    await waitFor(() => {
      expect(LocalStorageService.removeItem).toHaveBeenCalledWith('token');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });

  test('displays error message on search failure', async () => {
    (getChatCompletion as jest.Mock).mockRejectedValue(new Error('Erro na API'));

    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    // Preenche o campo de pesquisa e submete o formulário
    fireEvent.change(screen.getByPlaceholderText('Pergunte ao Assistente...'), { target: { value: 'teste' } });
    fireEvent.submit(screen.getByRole('button', { name: /enviar/i }));

    // Verifica se a mensagem de erro é exibida no modal
    await waitFor(() => {
      const modalBody = screen.getByRole('dialog').querySelector('.modal-body');
      expect(modalBody).toHaveTextContent('Ocorreu um erro ao consultar a API. Por favor, tente novamente.');
    });
  });
});
