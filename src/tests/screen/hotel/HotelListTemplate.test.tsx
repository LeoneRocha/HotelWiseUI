import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HotelListTemplate from '../../../components/HotelListTemplate'; // Ajuste o caminho conforme necessário 
import { IHotelListTemplateProps } from '../../../interfaces/DTO/Hotel/IHotelListTemplateProps';

// Mock do arquivo CSS para evitar problemas durante o teste
jest.mock('../css/HotelList.css', () => ({}));

const mockHotels = [
    { hotelId: 1, hotelName: 'Hotel One', description: 'Description One', tags: [], stars: 5, initialRoomPrice: 100, zipCode: '', location: '', city: '', stateCode: '', score: 8.9, isHotelInVectorStore: false },
    { hotelId: 2, hotelName: 'Hotel Two', description: 'Description Two', tags: [], stars: 4, initialRoomPrice: 150, zipCode: '', location: '', city: '', stateCode: '', score: 9.2, isHotelInVectorStore: false },
];

const renderComponent = (props: Partial<IHotelListTemplateProps> = {}) => {
    const defaultProps: IHotelListTemplateProps = {
        hotels: mockHotels,
        totalHotels: mockHotels.length,
        currentPage: 1,
        hotelsPerPage: 6,
        handleDelete: jest.fn(),
        paginate: jest.fn(),
        filter: '',
        handleFilterChange: jest.fn(),
        ...props,
    };

    render(
        <MemoryRouter>
            <HotelListTemplate {...defaultProps} />
        </MemoryRouter>
    );
};

describe('HotelListTemplate component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock do console.warn para suprimir os avisos durante os testes
        jest.spyOn(console, 'warn').mockImplementation(() => { });
    });
    test('renders hotel list and pagination', () => {
        renderComponent();

        // Verifica se os hotéis foram renderizados
        expect(screen.getByText('Hotel One')).toBeInTheDocument();
        expect(screen.getByText('Hotel Two')).toBeInTheDocument();

        // Verifica se a paginação está presente
        expect(screen.getByText('1')).toBeInTheDocument();
    });

    test('filters hotels based on input', () => {
        const handleFilterChange = jest.fn();
        renderComponent({ handleFilterChange });

        // Aplica um filtro
        fireEvent.change(screen.getByPlaceholderText(/Filtrar por nome do hotel/i), { target: { value: 'One' } });

        // Verifica se a função handleFilterChange foi chamada
        expect(handleFilterChange).toHaveBeenCalledWith('One');
    });

    test('deletes a hotel from the list', () => {
        const handleDelete = jest.fn();
        renderComponent({ handleDelete });

        // Clica no botão de apagar
        fireEvent.click(screen.getAllByText('Apagar')[0]);

        // Verifica se a função handleDelete foi chamada
        expect(handleDelete).toHaveBeenCalledWith(1);
    });

    test('paginates when a pagination item is clicked', () => {
        const paginate = jest.fn();
        renderComponent({ paginate });

        // Clica no item de paginação
        fireEvent.click(screen.getByText('1'));

        // Verifica se a função paginate foi chamada
        expect(paginate).toHaveBeenCalledWith(1);
    });
});
