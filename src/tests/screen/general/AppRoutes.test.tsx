import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import AppRoutes from '../../../routes'; 

// Mock do UserProfile
vi.mock('../../../components/general/UserProfile', () => ({
  default: () => <div>UserProfile</div>,
}));

describe('AppRoutes', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock do console.warn para suprimir os avisos durante os testes
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

    // Adicione outros testes conforme necessário
});
