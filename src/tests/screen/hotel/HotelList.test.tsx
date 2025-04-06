import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import HotelService from '../../../services/hotel/hotelService';
import { IServiceResponse } from '../../../interfaces/GeneralInterfaces';
import { IHotel } from '../../../interfaces/model/Hotel/IHotel';
import HotelList from '../../../components/hotel/HotelList';

// Mock do arquivo CSS para evitar problemas durante o teste
jest.mock('../../../css/HotelList.css', () => ({}));

// Mock dos serviços
jest.mock('../../../services/hotel/hotelService', () => ({
  getAll: jest.fn(),
  delete: jest.fn(),
}));

// Mock do retorno esperado do serviço
const mockServiceResponse: IServiceResponse<IHotel[]> = {
  data: [
    {
      hotelId: 1,
      hotelName: 'Hotel One',
      description: '',
      tags: [],
      stars: 5,
      initialRoomPrice: 100,
      zipCode: '',
      location: '',
      city: '',
      stateCode: '',
      score: 8.9,
      isHotelInVectorStore: false,
    },
    {
      hotelId: 2,
      hotelName: 'Hotel Two',
      description: '',
      tags: [],
      stars: 4,
      initialRoomPrice: 150,
      zipCode: '',
      location: '',
      city: '',
      stateCode: '',
      score: 9.2,
      isHotelInVectorStore: false,
    },
  ],
  success: true,
  message: 'Hotels fetched successfully',
  errors: [],
  unauthorized: false,
};

const mockDeleteResponse: IServiceResponse<string> = {
  data: 'Hotel deleted successfully',
  success: true,
  message: 'Hotel deleted successfully',
  errors: [],
  unauthorized: false,
};

describe('HotelList component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (HotelService.getAll as jest.Mock).mockResolvedValue(mockServiceResponse);
    (HotelService.delete as jest.Mock).mockResolvedValue(mockDeleteResponse);
    jest.spyOn(console, 'warn').mockImplementation(() => {});
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

    await waitFor(() => {
      expect(screen.getByText('Hotel One')).toBeInTheDocument();
      expect(screen.getByText('Hotel Two')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/filtrar/i), { target: { value: 'One' } });

    await waitFor(() => {
      expect(screen.queryByText('Hotel Two')).toBeNull();
      expect(screen.getByText('Hotel One')).toBeInTheDocument();
    });
  });

  test('handles error while fetching hotels', async () => {
    (HotelService.getAll as jest.Mock).mockRejectedValue(new Error('Fetch Error'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Ocorreu um erro ao buscar os hotéis.');
    });
  });

  test('deletes a hotel from the list', async () => {
    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Hotel One')).toBeInTheDocument();
      expect(screen.getByText('Hotel Two')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Apagar')[0]);

    await waitFor(() => {
      expect(HotelService.delete).toHaveBeenCalledWith(1);
    });

    await waitFor(() => {
      expect(screen.queryByText('Hotel One')).toBeNull();
      expect(screen.getByText('Hotel Two')).toBeInTheDocument();
    });
  });

  test('handles error while deleting a hotel', async () => {
    (HotelService.delete as jest.Mock).mockRejectedValue(new Error('Delete Error'));

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Hotel One')).toBeInTheDocument();
      expect(screen.getByText('Hotel Two')).toBeInTheDocument();
    });

    fireEvent.click(screen.getAllByText('Apagar')[0]);

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Ocorreu um erro ao excluir o hotel.');
    });
  });
});
