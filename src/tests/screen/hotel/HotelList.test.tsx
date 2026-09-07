import { type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import HotelService from '../../../services/hotel/hotelService';
import { IServiceResponse } from '../../../interfaces/GeneralInterfaces';
import { IHotel } from '../../../interfaces/model/Hotel/IHotel';
import HotelList from '../../../components/hotel/HotelList';

// Mock do arquivo CSS para evitar problemas durante o teste
vi.mock('../../../css/HotelList.css', async () => ({}));

// Mock dos serviços
vi.mock('../../../services/hotel/hotelService', async () => ({
  default: {
    getAll: vi.fn(),
    delete: vi.fn(),
    syncAllToVectorStore: vi.fn(),
  },
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
    vi.clearAllMocks();
    (HotelService.getAll as Mock).mockResolvedValue(mockServiceResponse);
    (HotelService.delete as Mock).mockResolvedValue(mockDeleteResponse);
    vi.spyOn(console, 'warn').mockImplementation(() => {});
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
    (HotelService.getAll as Mock).mockRejectedValue(new Error('Fetch Error'));

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
    (HotelService.delete as Mock).mockRejectedValue(new Error('Delete Error'));

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

  test('triggers syncAllToVectorStore and displays success feedback', async () => {
    (HotelService.syncAllToVectorStore as Mock).mockResolvedValue({
      success: true,
      data: {
        totalHotels: 2,
        synchronizedCount: 2,
        failedCount: 0,
        allProcessed: true,
        errors: [],
      },
      message: 'Todos os 2 hotéis foram sincronizados com sucesso no vetor.',
    });

    renderComponent();

    await waitFor(() => {
      expect(screen.getByText('Hotel One')).toBeInTheDocument();
    });

    const syncButton = screen.getByRole('button', { name: /sincronizar hotéis no vetor/i });
    expect(syncButton).toBeInTheDocument();
    fireEvent.click(syncButton);

    await waitFor(() => {
      expect(HotelService.syncAllToVectorStore).toHaveBeenCalled();
      expect(screen.getByRole('status')).toHaveTextContent('Todos os 2 hotéis foram sincronizados com sucesso no vetor.');
    });
  });

  test('displays detailed error message when API returns structured error', async () => {
    const apiError = {
      response: {
        status: 500,
        data: {
          correlationId: 'trace-xyz-999',
          errors: [
            {
              code: 'UNHANDLED_EXCEPTION',
              description: 'Database query failed.',
            },
          ],
        },
      },
    };
    (HotelService.getAll as Mock).mockRejectedValue(apiError);

    renderComponent();

    await waitFor(() => {
      const alert = screen.getByRole('alert');
      expect(alert).toHaveTextContent('Ocorreu um erro ao buscar os hotéis.');
      expect(alert).toHaveTextContent('[UNHANDLED_EXCEPTION] Database query failed.');
      expect(alert).toHaveTextContent('TraceId: trace-xyz-999');
      expect(alert).toHaveTextContent('HTTP 500');
    });
  });
});

