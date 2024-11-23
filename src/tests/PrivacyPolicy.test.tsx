import { render, screen } from '@testing-library/react';
import PrivacyPolicy from '../components/PrivacyPolicy'; // Ajuste o caminho conforme necessário

// Mock do arquivo CSS para evitar problemas durante o teste
jest.mock('../css/PrivacyPolicy.css', () => ({}));

describe('PrivacyPolicy component', () => {
  test('renders the PrivacyPolicy component with correct headings and texts', () => {
    render(<PrivacyPolicy />);

    // Verifica se os títulos e os textos principais estão presentes
    expect(screen.getByText('Política de Privacidade e Cookies')).toBeInTheDocument();
    expect(screen.getByText('Informações Gerais')).toBeInTheDocument();
    expect(screen.getByText('Coleta de Informações')).toBeInTheDocument();
    expect(screen.getByText('Uso de Informações')).toBeInTheDocument();
    expect(screen.getByText('Cookies')).toBeInTheDocument();
    expect(screen.getByText('Segurança das Informações')).toBeInTheDocument();
    expect(screen.getByText('Alterações a Esta Política de Privacidade')).toBeInTheDocument();
    expect(screen.getByText('Contato')).toBeInTheDocument();
    expect(screen.getByText('Email: suporte@exemplo.com')).toBeInTheDocument();
  });
});
