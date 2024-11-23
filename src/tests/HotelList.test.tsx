import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HotelList from '../components/HotelList'; // Ajuste o caminho conforme necessário
import { getAllHotels, deleteHotel } from '../services/hotelService';
import { IHotel } from '../interfaces/IHotel';


// Mock do arquivo CSS para evitar problemas durante o teste
jest.mock('../css/HotelList.css', () => ({}));

// Mock dos serviços
jest.mock('../services/hotelService', () => ({
  getAllHotels: jest.fn(),
  deleteHotel: jest.fn(),
}));

const mockHotels: IHotel[] = [
  { hotelId: 1, hotelName: 'Hotel One', description: '', tags: [], stars: 5, initialRoomPrice: 100, zipCode: '', location: '', city: '', stateCode: '', score: 8.9, isHotelInVectorStore: false },
  { hotelId: 2, hotelName: 'Hotel Two', description: '', tags: [], stars: 4, initialRoomPrice: 150, zipCode: '', location: '', city: '', stateCode: '', score: 9.2, isHotelInVectorStore: false },
];

describe('HotelList component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (getAllHotels as jest.Mock).mockResolvedValue(mockHotels);
     // Mock do console.warn para suprimir os avisos durante os testes
     jest.spyOn(console, 'warn').mockImplementation(() => { });
  });

  const renderComponent = () => {
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<HotelList />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders hotel list and filters hotels', async () => {
    renderComponent();

    // Verifica se os hotéis foram carregados
    await waitFor(() => {
      expect(screen.getByText('Hotel One')).toBeInTheDocument();
      expect(screen.getByText('Hotel Two')).toBeInTheDocument();
    });

    // Aplica um filtro
    fireEvent.change(screen.getByPlaceholderText(/filtrar/i), { target: { value: 'One' } });

    // Verifica se o filtro foi aplicado corretamente
    expect(screen.queryByText('Hotel Two')).toBeNull();
    expect(screen.getByText('Hotel One')).toBeInTheDocument();
  });

  test('deletes a hotel from the list', async () => {
    renderComponent();

    // Verifica se os hotéis foram carregados
    await waitFor(() => {
      expect(screen.getByText('Hotel One')).toBeInTheDocument();
      expect(screen.getByText('Hotel Two')).toBeInTheDocument();
    });

    // Exclui um hotel
    fireEvent.click(screen.getAllByText('Apagar')[0]);

    // Verifica se o serviço de exclusão foi chamado
    await waitFor(() => {
      expect(deleteHotel).toHaveBeenCalledWith(1);
    });

    // Verifica se o hotel foi removido da lista
    expect(screen.queryByText('Hotel One')).toBeNull();
    expect(screen.getByText('Hotel Two')).toBeInTheDocument();
  });
});
