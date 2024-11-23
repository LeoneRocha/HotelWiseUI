import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CookieConsent from '../components/CookieConsent'; // Ajuste o caminho conforme necessário
import LocalStorageService from '../services/localStorageService';

// Mock do arquivo CSS para evitar problemas durante o teste
jest.mock('../css/CookieConsent.css', () => ({}));

// Mock do LocalStorageService
jest.mock('../services/localStorageService', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

describe('CookieConsent component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders CookieConsent when consent is not given', async () => {
    // Simula que o consentimento não foi dado
    (LocalStorageService.getItem as jest.Mock).mockReturnValue(null);

    render(<CookieConsent />);

    // Verifica se o componente está visível usando um matcher mais flexível
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('Este site utiliza cookies para melhorar a experiência do usuário'))).toBeInTheDocument();
    });

    expect(screen.getByText('Aceitar')).toBeInTheDocument();
    expect(screen.getByText('Recusar')).toBeInTheDocument();
  });

  test('does not render CookieConsent when consent is given', () => {
    // Simula que o consentimento foi dado
    (LocalStorageService.getItem as jest.Mock).mockReturnValue('true');

    render(<CookieConsent />);

    // Verifica se o componente não está visível
    expect(screen.queryByText((content) => content.includes('Este site utiliza cookies para melhorar a experiência do usuário'))).toBeNull();
  });

  test('sets consent in local storage and hides banner when accept is clicked', async () => {
    // Simula que o consentimento não foi dado
    (LocalStorageService.getItem as jest.Mock).mockReturnValue(null);

    render(<CookieConsent />);

    // Clica no botão "Aceitar"
    fireEvent.click(screen.getByText('Aceitar'));

    // Verifica se o consentimento foi salvo no local storage
    expect(LocalStorageService.setItem).toHaveBeenCalledWith('cookieConsent', 'true');

    // Verifica se o banner de consentimento foi escondido
    await waitFor(() => {
      expect(screen.queryByText((content) => content.includes('Este site utiliza cookies para melhorar a experiência do usuário'))).toBeNull();
    });
  });

  test('hides banner when decline is clicked', async () => {
    // Simula que o consentimento não foi dado
    (LocalStorageService.getItem as jest.Mock).mockReturnValue(null);

    render(<CookieConsent />);

    // Clica no botão "Recusar"
    fireEvent.click(screen.getByText('Recusar'));

    // Verifica se o banner de consentimento foi escondido
    await waitFor(() => {
      expect(screen.queryByText((content) => content.includes('Este site utiliza cookies para melhorar a experiência do usuário'))).toBeNull();
    });
  });
});
