import { type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router'; 
import LocalStorageService from '../../../services/general/localStorageService';
import { nameStorageTokenJWT } from '../../../auth-config';
import Navbar from '../../../components/general/Navbar';
 
// Mock do arquivo CSS para evitar problemas durante o teste
vi.mock('../../../css/Navbar.css', async () => ({}));

// Mock dos serviços
vi.mock('../../../services/iainteference/assistantService', async () => ({
  default: {
  getChatCompletion: vi.fn(),
  },
}));
vi.mock('../../../services/general/localStorageService', async () => ({
  default: {
  removeItem: vi.fn(),
  },
}));

// Mock do `useNavigate`
vi.mock('react-router', async () => ({
  ...await vi.importActual('react-router'),
  useNavigate: vi.fn(),
}));

// Suprimir logs de erro no console
beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});  
describe('Navbar component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    (useNavigate as Mock).mockReturnValue(mockNavigate);
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
