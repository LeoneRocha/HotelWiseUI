import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AccessDenied from '../../../components/AccessDenied'; // Ajuste o caminho conforme necessário

// Mock do arquivo CSS para evitar problemas durante o teste
jest.mock('../../css/AccessDenied.css', () => ({}));

// Interface para as propriedades do ErrorBoundary
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

// Interface para o estado do ErrorBoundary
interface ErrorBoundaryState {
  hasError: boolean;
}

// Componente ErrorBoundary para capturar erros durante os testes
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Error caught by ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong.</div>;
    }

    return this.props.children; 
  }
}

describe('AccessDenied component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock do console.warn para suprimir os avisos durante os testes
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterAll(() => {
    // Restaurar a implementação original do console.warn após os testes
    jest.restoreAllMocks();
  });

  test('renders the AccessDenied component', () => {
    render(
      <MemoryRouter>
        <ErrorBoundary>
          <AccessDenied />
        </ErrorBoundary>
      </MemoryRouter>
    );

    // Verifica se o título está presente
    expect(screen.getByText('Acesso Negado')).toBeInTheDocument();

    // Verifica se a mensagem está presente
    expect(screen.getByText('Você não tem permissão para acessar esta página.')).toBeInTheDocument();

    // Verifica se o link para voltar para a página inicial está presente
    expect(screen.getByRole('link', { name: /Voltar para a página inicial/i })).toHaveAttribute('href', '/');
  });
});
