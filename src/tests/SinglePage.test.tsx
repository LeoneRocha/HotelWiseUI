import { act, render, screen } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import SinglePage from '../SinglePage';  

// Mock do LocalStorageService
jest.mock('../services/localStorageService', () => ({
    hasItem: jest.fn(() => false), // Assume que o usuário não está logado
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

describe('SinglePage', () => {
    const mockNavigate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
        // Mock do console.warn e console.error para suprimir avisos e erros durante os testes
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
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
