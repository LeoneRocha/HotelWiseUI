import { type Mock } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router';
import SinglePage from '../../../components/general/SinglePage';  

// Mock do LocalStorageService
vi.mock('../../../services/general/localStorageService', async () => ({
  default: {
    hasItem: vi.fn(() => false), // Assume que o usuário não está logado
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}));

vi.mock('react-router', async () => ({
    ...await vi.importActual('react-router'),
    useNavigate: vi.fn(),
}));

vi.mock('../../../components/general/UserProfile', () => ({
  default: () => <div>UserProfile</div>,
}));

describe('SinglePage', () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as Mock).mockReturnValue(mockNavigate);
        // Mock do console.warn e console.error para suprimir avisos e erros durante os testes
        vi.spyOn(console, 'warn').mockImplementation(() => { });
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    test('should render HeaderPage when not on the root route', async () => { 
        await act(async () => {
            render(
                <MemoryRouter initialEntries={['/login']}>
                    <SinglePage />
                </MemoryRouter>
            );
        });
        expect(screen.getByText('Pesquisa de Hotel IA')).toBeInTheDocument();
    });
});
