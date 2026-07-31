import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import NotFound from '../../../components/general/NotFound';


// Mock do arquivo CSS para evitar problemas durante o teste
vi.mock('../../css/NotFound.css', async () => ({}));

describe('NotFound component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock do console.warn para suprimir os avisos durante os testes
        vi.spyOn(console, 'warn').mockImplementation(() => { });
    });
    test('renders the NotFound component with correct text and link', () => {
        render(
            <MemoryRouter>
                <NotFound />
            </MemoryRouter>
        );

        // Verifica se o ícone de busca está presente pela classe
        expect(document.querySelector('.fas.fa-search.notfound-icon.mb-4')).toBeInTheDocument();

        // Verifica se o texto "404" está presente
        expect(screen.getByText('404')).toBeInTheDocument();

        // Verifica se a mensagem "Oops! Página não encontrada." está presente
        expect(screen.getByText('Oops! Página não encontrada.')).toBeInTheDocument();

        // Verifica se o link para voltar para a página inicial está presente
        expect(screen.getByRole('link', { name: /Voltar para a página inicial/i })).toHaveAttribute('href', '/');
    });
});