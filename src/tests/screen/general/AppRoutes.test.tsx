import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AppRoutes from '../../../routes'; 

// Mock do UserProfile
jest.mock('../../../components/UserProfile', () => {
  return function DummyUserProfile() {
    return <div>UserProfile</div>;
  };
});

describe('AppRoutes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock do console.warn para suprimir os avisos durante os testes
        jest.spyOn(console, 'warn').mockImplementation(() => { });
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
