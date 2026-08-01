import { type Mock } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router'; 
import HotelService from '../../../services/hotel/hotelService';
import { IServiceResponse } from '../../../interfaces/GeneralInterfaces';
import { IHotel } from '../../../interfaces/model/Hotel/IHotel';
import HotelForm from '../../../components/hotel/HotelForm';

// Mock do arquivo CSS para evitar problemas durante o teste
vi.mock('../../../css/HotelFormTemplate.css', async () => ({}));

// Mock dos serviços
vi.mock('../../../services/hotel/hotelService', async () => ({
  default: {
  getAll: vi.fn(),
  delete: vi.fn(),
  getById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  generateHotelByIA: vi.fn(),
  addVectorById: vi.fn(),
  },
}));

const mockHotel: IServiceResponse<IHotel> = {
  data: {
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
  },
  success: true,
  message: 'Hotel fetched successfully',
  errors: [],
  unauthorized: false,
};

const mockCreateResponse: IServiceResponse<IHotel> = {
  data: {
    hotelId: 2,
    hotelName: 'New Hotel',
    description: 'New description',
    tags: [],
    stars: 4,
    initialRoomPrice: 150,
    zipCode: '',
    location: 'Location',
    city: 'New City',
    stateCode: 'NC',
    score: 8.5,
    isHotelInVectorStore: false,
  },
  success: true,
  message: 'Hotel created successfully',
  errors: [],
  unauthorized: false,
};

const mockUpdateResponse: IServiceResponse<IHotel> = {
  data: {
    hotelId: 1,
    hotelName: 'Updated Hotel',
    description: 'Updated description',
    tags: [],
    stars: 5,
    initialRoomPrice: 200,
    zipCode: '',
    location: 'Updated Location',
    city: 'Updated City',
    stateCode: 'UC',
    score: 9.2,
    isHotelInVectorStore: true,
  },
  success: true,
  message: 'Hotel updated successfully',
  errors: [],
  unauthorized: false,
};

describe('HotelForm component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  const renderComponent = (initialEntries = ['/new']) => {
    render(
      <MemoryRouter initialEntries={initialEntries}>
        <Routes>
          <Route path="/:id" element={<HotelForm onSave={vi.fn()} />} />
        </Routes>
      </MemoryRouter>
    );
  };

  test('renders new hotel form', () => {
    renderComponent();

    expect(screen.getByText('Adicionar Hotel')).toBeInTheDocument();
  });

  test('loads hotel data for editing', async () => {
    (HotelService.getById as Mock).mockResolvedValue(mockHotel);

    renderComponent(['/1']);

    await waitFor(() => {
      expect(screen.getByText('Editar Hotel')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Hotel')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
    });
  });

  test('loads hotel data from /tabs/:id style route', async () => {
    (HotelService.getById as Mock).mockResolvedValue(mockHotel);

    render(
      <MemoryRouter initialEntries={['/tabs/9']}>
        <Routes>
          <Route path="/tabs/:id" element={<HotelForm onSave={vi.fn()} hotelId={9} />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Editar Hotel')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Hotel')).toBeInTheDocument();
    });
  });

  test('hydrates from hotel prop without refetch race', async () => {
    render(
      <MemoryRouter initialEntries={['/tabs/1']}>
        <Routes>
          <Route
            path="/tabs/:id"
            element={<HotelForm onSave={vi.fn()} hotelId={1} hotel={mockHotel.data} />}
          />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Editar Hotel')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Hotel')).toBeInTheDocument();
    expect(HotelService.getById).not.toHaveBeenCalled();
  });

  test('creates a new hotel', async () => {
    (HotelService.create as Mock).mockResolvedValue(mockCreateResponse);

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Nome do Hotel/i), { target: { value: 'New Hotel' } });
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'New description' } });

    fireEvent.submit(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(HotelService.create).toHaveBeenCalled();
      expect(screen.getByText('Hotel criado com sucesso!')).toBeInTheDocument();
    });
  });

  test('updates an existing hotel', async () => {
    (HotelService.getById as Mock).mockResolvedValue(mockHotel);
    (HotelService.update as Mock).mockResolvedValue(mockUpdateResponse);

    renderComponent(['/1']);

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText(/Nome do Hotel/i), { target: { value: 'Updated Hotel' } });
    });

    fireEvent.submit(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(HotelService.update).toHaveBeenCalled();
      expect(screen.getByText('Hotel atualizado com sucesso!')).toBeInTheDocument();
    });
  });

  test('handles errors during form submission', async () => {
    (HotelService.create as Mock).mockRejectedValue(new Error('Create Hotel Error'));

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Nome do Hotel/i), { target: { value: 'New Hotel' } });
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'New description' } });

    fireEvent.submit(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(screen.getByText('Ocorreu um erro ao salvar o hotel. Por favor, tente novamente.')).toBeInTheDocument();
    });
  });
});
