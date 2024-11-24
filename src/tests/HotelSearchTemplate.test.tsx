import { render, screen } from '@testing-library/react';
import HotelSearchTemplate from '../components/HotelSearchTemplate'; // Ajuste o caminho conforme necessário
import { HotelSearchTemplateProps } from '../interfaces/HotelSearchTemplateProps';
import { ServiceResponse } from '../interfaces/authTypes';
import { IHotelSemanticResult } from '../interfaces/IHotelSemanticResult';

// Mock do arquivo CSS para evitar problemas durante o teste
jest.mock('../css/HotelSearchTemplate.css', () => ({}));

const mockServiceResponse: ServiceResponse<IHotelSemanticResult> = {
    data: {
        hotelsVectorResult: [
            { hotelId: 1, hotelName: 'Hotel Vector One', description: 'Description One', tags: [], stars: 5, initialRoomPrice: 100, zipCode: '', location: '', city: '', stateCode: '', score: 8.9, isHotelInVectorStore: false },
            { hotelId: 2, hotelName: 'Hotel Vector Two', description: 'Description Two', tags: [], stars: 4, initialRoomPrice: 150, zipCode: '', location: '', city: '', stateCode: '', score: 9.2, isHotelInVectorStore: false },
        ],
        hotelsIAResult: [],
        promptResultContent: '',
    },
    success: true,
    message: '',
    errors: [],
    unauthorized: false,
};
const renderComponent = (props: Partial<HotelSearchTemplateProps> = {}) => {
    const defaultProps: HotelSearchTemplateProps = {
        searchTerm: '',
        setSearchTerm: jest.fn(),
        serviceResponse: mockServiceResponse,
        searched: false,
        error: null,
        loading: false,
        handleSearch: jest.fn(),
        showAlert: false,
        setShowAlert: jest.fn(),
        tags: ['Tag1', 'Tag2', 'Tag3'],
        selectedTags: [],
        handleTagChange: jest.fn(),
        ...props,
    };

    render(<HotelSearchTemplate {...defaultProps} />);
};

describe('HotelSearchTemplate component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock do console.warn para suprimir os avisos durante os testes
        jest.spyOn(console, 'warn').mockImplementation(() => { });
    });
    test('renders search form and tags', () => {
        renderComponent();

        // Verifica se o formulário de busca é renderizado
        expect(screen.getByPlaceholderText('Buscar hotéis...')).toBeInTheDocument();
        expect(screen.getByText('Buscar')).toBeInTheDocument();

        // Verifica se as tags são renderizadas
        expect(screen.getByText('Tag1')).toBeInTheDocument();
        expect(screen.getByText('Tag2')).toBeInTheDocument();
        expect(screen.getByText('Tag3')).toBeInTheDocument();
    }); 
});
