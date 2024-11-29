import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Ajuste o caminho conforme necessário
import LocalStorageService from '../services/localStorageService';
 
// Mock do arquivo CSS para evitar problemas durante o teste
jest.mock('../css/Navbar.css', () => ({}));

// Mock dos serviços
jest.mock('../services/assistantService', () => ({
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
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  test('handles logout', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByTitle('Logout'));

    await waitFor(() => {
      expect(screen.getByText('Confirmar Logout')).toBeInTheDocument();
    });

    const logoutButtons = screen.getAllByRole('button', { name: /logout/i });
    fireEvent.click(logoutButtons[logoutButtons.length - 1]);

    await waitFor(() => {
      expect(LocalStorageService.removeItem).toHaveBeenCalledWith('token');
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
