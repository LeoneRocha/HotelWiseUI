import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom'; 
import HotelService from '../../../services/hotel/hotelService';
import { IServiceResponse } from '../../../interfaces/GeneralInterfaces';
import { IHotel } from '../../../interfaces/model/Hotel/IHotel';
import HotelForm from '../../../components/hotel/HotelForm';

// Mock do arquivo CSS para evitar problemas durante o teste
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
    jest.clearAllMocks();
    jest.spyOn(console, 'warn').mockImplementation(() => {});
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

    expect(screen.getByText('Adicionar Hotel')).toBeInTheDocument();
  });

  test('loads hotel data for editing', async () => {
    (HotelService.getById as jest.Mock).mockResolvedValue(mockHotel);

    renderComponent(['/1']);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Test Hotel')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test description')).toBeInTheDocument();
    });
  });

  test('creates a new hotel', async () => {
    (HotelService.create as jest.Mock).mockResolvedValue(mockCreateResponse);

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
    (HotelService.getById as jest.Mock).mockResolvedValue(mockHotel);
    (HotelService.update as jest.Mock).mockResolvedValue(mockUpdateResponse);

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
    (HotelService.create as jest.Mock).mockRejectedValue(new Error('Create Hotel Error'));

    renderComponent();

    fireEvent.change(screen.getByLabelText(/Nome do Hotel/i), { target: { value: 'New Hotel' } });
    fireEvent.change(screen.getByLabelText(/Descrição/i), { target: { value: 'New description' } });

    fireEvent.submit(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => {
      expect(screen.getByText('Ocorreu um erro ao salvar o hotel. Por favor, tente novamente.')).toBeInTheDocument();
    });
  });
});
