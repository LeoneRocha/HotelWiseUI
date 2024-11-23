import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HotelForm from '../components/HotelForm'; // Ajuste o caminho conforme necessário
import { getHotelById, createHotel, updateHotel } from '../services/hotelService';

jest.mock('../css/HotelFormTemplate.css', () => ({}));
// Mock dos serviços
jest.mock('../services/hotelService', () => ({
    getHotelById: jest.fn(),
    createHotel: jest.fn(),
    updateHotel: jest.fn(),
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

        (getHotelById as jest.Mock).mockResolvedValue(mockHotel);

        renderComponent(['/1']);

        // Verifica se os dados do hotel foram carregados no formulário
        await waitFor(() => {
            expect(screen.getByDisplayValue('Test Hotel')).toBeInTheDocument();
            expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
        });
    });

    test('creates a new hotel', async () => {
        (createHotel as jest.Mock).mockResolvedValue({});

        renderComponent();

        // Preenche o formulário
        fireEvent.change(screen.getByLabelText(/Nome do Hotel/i), { target: { value: 'New Hotel' } });
        fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'New description' } });

        // Submete o formulário
        fireEvent.submit(screen.getByRole('button', { name: /salvar/i }));

        // Verifica se o hotel foi criado
        await waitFor(() => {
            expect(createHotel).toHaveBeenCalled();
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

        (getHotelById as jest.Mock).mockResolvedValue(mockHotel);

        renderComponent(['/1']);

        // Preenche o formulário com novos dados
        await waitFor(() => {
            fireEvent.change(screen.getByLabelText(/Nome do Hotel/i), { target: { value: 'Updated Hotel' } });
        });

        // Submete o formulário
        fireEvent.submit(screen.getByRole('button', { name: /salvar/i }));

        // Verifica se o hotel foi atualizado
        await waitFor(() => {
            expect(updateHotel).toHaveBeenCalled();
            expect(screen.getByText('Hotel atualizado com sucesso!')).toBeInTheDocument();
        });
    });

    test('handles errors during form submission', async () => {
        (createHotel as jest.Mock).mockRejectedValue(new Error('Create Hotel Error'));

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
