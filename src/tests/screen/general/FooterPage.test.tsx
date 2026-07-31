import { type Mock } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react'; 
import AppInformationService from '../../../services/appInformationService';
import FooterPage from '../../../components/general/FooterPage';

// Mock the EnvironmentService

vi.mock('../../../services/general/EnvironmentService', async () => ({
    __esModule: true,
    default: {
        getUIVersion: vi.fn(() => '1.0'),
        getApiBaseUrl: vi.fn(() => 'http://localhost:3000/api'),
        isNotTestEnvironment: vi.fn(() => false),
    }
}));

// Mock the getAppInformationVersionProduct service
vi.mock('../../../services/appInformationService', async () => ({
  default: {
    getAppInformationVersionProduct: vi.fn(),
  },
}));

describe('FooterPage', () => {
    beforeEach(() => {
        (AppInformationService.getAppInformationVersionProduct as Mock).mockResolvedValue([{ version: '1.2.3' }]);
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
        (AppInformationService.getAppInformationVersionProduct as Mock).mockRejectedValue(new Error('Erro ao buscar a versão da API'));

        await act(async () => {
            render(<FooterPage />);
        });

        await waitFor(() => {
            expect(screen.getByText(/API Version:/i)).toBeInTheDocument();
            expect(screen.getByText('Carregando...')).toBeInTheDocument(); // Default behavior when there's an error
        });
    });
});
