import { render, screen, waitFor, act } from '@testing-library/react';
import FooterPage from '../../../FooterPage';
import AppInformationService from '../../../services/appInformationService';

// Mock the EnvironmentService

jest.mock('../../../services/general/EnvironmentService', () => ({
    __esModule: true,
    default: {
        getUIVersion: jest.fn(() => '1.0'),
        getApiBaseUrl: jest.fn(() => 'http://localhost:3000/api'),
        isNotTestEnvironment: jest.fn(() => false),
    }
}));

// Mock the getAppInformationVersionProduct service
jest.mock('../../../services/appInformationService', () => ({
    getAppInformationVersionProduct: jest.fn(),
}));

describe('FooterPage', () => {
    beforeEach(() => {
        (AppInformationService.getAppInformationVersionProduct as jest.Mock).mockResolvedValue([{ version: '1.2.3' }]);
    });

    afterEach(() => {
        jest.clearAllMocks();
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
        (AppInformationService.getAppInformationVersionProduct as jest.Mock).mockRejectedValue(new Error('Erro ao buscar a versão da API'));

        await act(async () => {
            render(<FooterPage />);
        });

        await waitFor(() => {
            expect(screen.getByText(/API Version:/i)).toBeInTheDocument();
            expect(screen.getByText('Carregando...')).toBeInTheDocument(); // Default behavior when there's an error
        });
    });
});
