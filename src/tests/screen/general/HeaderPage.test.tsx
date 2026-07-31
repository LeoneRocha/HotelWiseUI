import { render, screen } from '@testing-library/react'; 
import HeaderPage from '../../../components/general/HeaderPage';

// Mock dos arquivos CSS para evitar problemas durante o teste
vi.mock('../App.css', async () => ({}));
vi.mock('../../css/HeaderPage.css', async () => ({}));

describe('HeaderPage component', () => {
  test('renders the HeaderPage component with correct text', () => {
    render(<HeaderPage />);

    // Verifica se o texto "Pesquisa de Hotel IA" está presente
    expect(screen.getByText('Pesquisa de Hotel IA')).toBeInTheDocument();
  });
});
