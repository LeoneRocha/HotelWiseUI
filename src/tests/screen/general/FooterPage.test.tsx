import { type Mock } from 'vitest';
import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import AppInformationService from '../../../services/appInformationService';
import TechnologyCatalogService from '../../../services/technologyCatalogService';
import FooterPage from '../../../components/general/FooterPage';

vi.mock('../../../services/general/EnvironmentService', async () => ({
  __esModule: true,
  default: {
    getUIVersion: vi.fn(() => '1.0'),
    getApiBaseUrl: vi.fn(() => 'http://localhost:3000/api'),
    isNotTestEnvironment: vi.fn(() => false),
  },
}));

vi.mock('../../../services/appInformationService', async () => ({
  default: {
    getAppInformationVersionProduct: vi.fn(),
  },
}));

vi.mock('../../../services/technologyCatalogService', async () => ({
  default: {
    getTechnologies: vi.fn(),
  },
}));

describe('FooterPage', () => {
  beforeEach(() => {
    (AppInformationService.getAppInformationVersionProduct as Mock).mockResolvedValue([
      { version: '1.2.3' },
    ]);
    (TechnologyCatalogService.getTechnologies as Mock).mockResolvedValue([
      {
        id: 'react',
        name: 'React',
        url: 'https://react.dev',
        image: 'https://example.com/react.svg',
        layer: 'frontend',
        featured: true,
        version: '19.2.8',
      },
      {
        id: 'dotnet',
        name: '.NET',
        url: 'https://dotnet.microsoft.com/',
        image: 'https://example.com/dotnet.svg',
        layer: 'backend',
        version: '8',
        description: 'API',
      },
    ]);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should render the footer with the correct UI version', async () => {
    await act(async () => {
      render(<FooterPage />);
    });

    expect(screen.getByText(/UI Version:/i)).toBeInTheDocument();
    expect(screen.getByText('1.0')).toBeInTheDocument();
  });

  test('should fetch and render the API version', async () => {
    await act(async () => {
      render(<FooterPage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/API Version:/i)).toBeInTheDocument();
      expect(screen.getByText('1.2.3')).toBeInTheDocument();
    });
  });

  test('should handle errors when fetching the API version', async () => {
    (AppInformationService.getAppInformationVersionProduct as Mock).mockRejectedValue(
      new Error('Erro ao buscar a versão da API')
    );

    await act(async () => {
      render(<FooterPage />);
    });

    await waitFor(() => {
      expect(screen.getByText(/API Version:/i)).toBeInTheDocument();
      expect(screen.getByText('Carregando...')).toBeInTheDocument();
    });
  });

  test('should keep icons visible by category and toggle textual catalog', async () => {
    await act(async () => {
      render(<FooterPage />);
    });

    await waitFor(() => {
      expect(screen.getByTestId('footer-tech-icons')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Exibir detalhes textuais/i })).toBeInTheDocument();
    });

    expect(screen.getByTestId('footer-tech-icons')).toHaveTextContent('Frontend');
    expect(screen.getByTestId('footer-tech-icons')).toHaveTextContent('Backend');
    expect(screen.queryByTestId('footer-tech-text')).not.toBeInTheDocument();

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /Exibir detalhes textuais/i }));
    });

    expect(screen.getByTestId('footer-tech-icons')).toBeInTheDocument();
    expect(screen.getByTestId('footer-tech-text')).toBeInTheDocument();
    expect(screen.getByTestId('footer-tech-text')).toHaveTextContent('React');
    expect(screen.getByTestId('footer-tech-text')).toHaveTextContent('versão 19.2.8');
    expect(screen.getByTestId('footer-tech-text')).toHaveTextContent('.NET');
    expect(screen.getByTestId('footer-tech-text')).toHaveTextContent('versão 8');
    expect(screen.getByTestId('footer-tech-text')).toHaveTextContent('API');
    expect(screen.getByTestId('footer-tech-text').querySelector('a')).toBeNull();
    expect(screen.getByRole('button', { name: /Ocultar detalhes textuais/i })).toBeInTheDocument();
  });
});
