import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom'; 
import LocalStorageService from '../../../services/general/localStorageService';
import { nameStorageTokenJWT } from '../../../auth-config';
import Navbar from '../../../components/general/Navbar';
 
// Mock do arquivo CSS para evitar problemas durante o teste
jest.mock('../../../css/Navbar.css', () => ({}));

// Mock dos serviços
jest.mock('../../../services/iainteference/assistantService', () => ({
  getChatCompletion: jest.fn(),
}));
jest.mock('../../../services/general/localStorageService', () => ({
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
      expect(LocalStorageService.removeItem).toHaveBeenCalledWith(nameStorageTokenJWT);
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
