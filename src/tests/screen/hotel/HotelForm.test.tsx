import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom'; 
import HotelService from '../../../services/hotel/hotelService';
import HotelForm from '../../../components/hotel/HotelForm';

jest.mock('../../../css/HotelFormTemplate.css', () => ({}));
// Mock dos serviços 

jest.mock('../../../services/hotel/hotelService', () => ({
    getAll: jest.fn(),
    delete: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    generateHotelByIA: jest.fn(),
    addVectorById: jest.fn(),
  }));


describe('HotelForm component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock do console.warn para suprimir os avisos durante os testes
        jest.spyOn(console, 'warn').mockImplementation(() => { });
    });
    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = (initialEntries = ['/new']) => {
        render(
            <MemoryRouter initialEntries={initialEntries}>
                <Routes>
                    <Route path="/:id" element={<HotelForm onSave={jest.fn()} />} />
                </Routes>
            </MemoryRouter>
        );
    };

    test('renders new hotel form', () => {
        renderComponent();

        // Verifica se o título do formulário de novo hotel está presente
        expect(screen.getByText('Adicionar Hotel')).toBeInTheDocument();
    });

    test('loads hotel data for editing', async () => {
        const mockHotel = {
            hotelId: 1,
            hotelName: 'Test Hotel',
            description: 'Test description',
            tags: [],
            stars: 5,
            initialRoomPrice: 100,
            zipCode: '00000-000',
            location: 'Test Location',
            city: 'Test City',
            stateCode: 'TS',
            score: 8.9,
            isHotelInVectorStore: false,
        };

        (HotelService.getById as jest.Mock).mockResolvedValue(mockHotel);

        renderComponent(['/1']);

        // Verifica se os dados do hotel foram carregados no formulário
        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Hotel')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
        });
    });

    test('creates a new hotel', async () => {
        (HotelService.create as jest.Mock).mockResolvedValue({});

        renderComponent();

        // Preenche o formulário
        fireEvent.change(screen.getByLabelText(/Nome do Hotel/i), { target: { value: 'New Hotel' } });
        fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'New description' } });

        // Submete o formulário
        fireEvent.submit(screen.getByRole('button', { name: /salvar/i }));

        // Verifica se o hotel foi criado
        await waitFor(() => {
            expect(HotelService.create).toHaveBeenCalled();
            expect(screen.getByText('Hotel criado com sucesso!')).toBeInTheDocument();
        });
    });

    test('updates an existing hotel', async () => {
        const mockHotel = {
            hotelId: 1,
            hotelName: 'Test Hotel',
            description: 'Test description',
            tags: [],
            stars: 5,
            initialRoomPrice: 100,
            zipCode: '00000-000',
            location: 'Test Location',
            city: 'Test City',
            stateCode: 'TS',
            score: 8.9,
            isHotelInVectorStore: false,
        };

        (HotelService.getById as jest.Mock).mockResolvedValue(mockHotel);

        renderComponent(['/1']);

        // Preenche o formulário com novos dados
        await waitFor(() => {
            fireEvent.change(screen.getByLabelText(/Nome do Hotel/i), { target: { value: 'Updated Hotel' } });
        });

        // Submete o formulário
        fireEvent.submit(screen.getByRole('button', { name: /salvar/i }));

        // Verifica se o hotel foi atualizado
        await waitFor(() => {
            expect(HotelService.update).toHaveBeenCalled();
            expect(screen.getByText('Hotel atualizado com sucesso!')).toBeInTheDocument();
        });
    });

    test('handles errors during form submission', async () => {
        (HotelService.create as jest.Mock).mockRejectedValue(new Error('Create Hotel Error'));

        renderComponent();

        // Preenche o formulário
        fireEvent.change(screen.getByLabelText(/Nome do Hotel/i), { target: { value: 'New Hotel' } });
        fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'New description' } });

        // Submete o formulário
        fireEvent.submit(screen.getByRole('button', { name: /salvar/i }));

        // Verifica se o erro foi tratado e exibido
        await waitFor(() => {
            expect(screen.getByText('Ocorreu um erro ao salvar o hotel. Por favor, tente novamente.')).toBeInTheDocument();
        });
    });
});
