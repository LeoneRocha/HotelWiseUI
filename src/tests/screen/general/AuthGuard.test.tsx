import { type Mock } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import AuthGuard from '../../../components/general/AuthGuard'; // Ajuste o caminho conforme necessário
import LocalStorageService from '../../../services/general/localStorageService';
import SecurityService from '../../../services/general/securityService';

// Mock dos serviços de LocalStorage e Segurança
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
        // Mock do console.warn para suprimir os avisos durante os testes
        vi.spyOn(console, 'warn').mockImplementation(() => { });
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    test('renders children when token is valid', () => {
        (LocalStorageService.getItem as Mock).mockReturnValue('valid-token');
        (SecurityService.isTokenExpired as Mock).mockReturnValue(false);

        const { getByText } = render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<AuthGuard><div>Protected Content</div></AuthGuard>} />
                </Routes>
            </MemoryRouter>
        );

        // Verifica se o conteúdo protegido é renderizado
        expect(getByText('Protected Content')).toBeInTheDocument();
    });

    test('redirects to login when token is expired', () => {
        (LocalStorageService.getItem as Mock).mockReturnValue('expired-token');
        (SecurityService.isTokenExpired as Mock).mockReturnValue(true);

        const { getByText } = render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<AuthGuard><div>Protected Content</div></AuthGuard>} />
                    <Route path="/login" element={<div>Login Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Verifica se o redirecionamento para a página de login ocorre
        expect(getByText('Login Page')).toBeInTheDocument();
    });

    test('redirects to access denied when token is not present', () => {
        (LocalStorageService.getItem as Mock).mockReturnValue(null);

        const { getByText } = render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<AuthGuard><div>Protected Content</div></AuthGuard>} />
                    <Route path="/access-denied" element={<div>Access Denied Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Verifica se o redirecionamento para a página de acesso negado ocorre
        expect(getByText('Access Denied Page')).toBeInTheDocument();
    });
});
