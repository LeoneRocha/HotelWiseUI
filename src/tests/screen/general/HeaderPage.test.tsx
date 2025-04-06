import { render, screen } from '@testing-library/react'; 
import HeaderPage from '../../../components/general/HeaderPage';

// Mock dos arquivos CSS para evitar problemas durante o teste
jest.mock('../App.css', () => ({}));
jest.mock('../../css/HeaderPage.css', () => ({}));

describe('HeaderPage component', () => {
  test('renders the HeaderPage component with correct text', () => {
    render(<HeaderPage />);

    // Verifica se o texto "Pesquisa de Hotel IA" está presente
    expect(screen.getByText('Pesquisa de Hotel IA')).toBeInTheDocument();
  });
});
