import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import HotelService from '../../../services/hotel/hotelService';
import { IServiceResponse } from '../../../interfaces/GeneralInterfaces';
import { IHotelSemanticResult } from '../../../interfaces/model/Hotel/IHotelSemanticResult';
import HotelSearch from '../../../components/hotel/HotelSearch';

// Mock do arquivo CSS para evitar problemas durante o teste
jest.mock('../../../css/HotelSearch.css', () => ({}));
jest.mock('../../../css/HotelSearchTemplate.css', () => ({}));

// Mock dos serviços
jest.mock('../../../services/hotel/hotelService', () => ({
  semanticSearch: jest.fn(),
  getTags: jest.fn(),
}));

const mockTags: string[] = ['Tag1', 'Tag2', 'Tag3'];

const mockServiceResponse: IServiceResponse<IHotelSemanticResult> = {
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

describe('HotelSearch component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (HotelService.getTags as jest.Mock).mockResolvedValue(mockTags);
    jest.spyOn(console, 'warn').mockImplementation(() => { });
  });

  test('fetches and displays tags', async () => {
    render(<HotelSearch />);

    // Verifica se as tags foram carregadas
    await waitFor(() => {
      expect(screen.getByText('Tag1')).toBeInTheDocument();
      expect(screen.getByText('Tag2')).toBeInTheDocument();
      expect(screen.getByText('Tag3')).toBeInTheDocument();
    });
  });

  test('handles tag selection', async () => {
    render(<HotelSearch />);

    // Seleciona uma tag
    await waitFor(() => {
      fireEvent.click(screen.getByText('Tag1'));
    });

    // Verifica se a tag foi selecionada
    const tagButton = screen.getByText('Tag1').closest('button');
    expect(tagButton).toHaveClass('btn btn-primary m-1');
  });

  test('performs a search and displays results', async () => {
    (HotelService.semanticSearch as jest.Mock).mockResolvedValue(mockServiceResponse);

    render(<HotelSearch />);

    // Insere um termo de busca
    fireEvent.change(screen.getByPlaceholderText(/buscar/i), { target: { value: 'Hotel Vector' } });

    // Submete o formulário
    fireEvent.submit(screen.getByRole('button', { name: /buscar/i }));

    // Verifica se os resultados foram exibidos
    await waitFor(() => {
      expect(screen.getByText('Hotel Vector One')).toBeInTheDocument();
      expect(screen.getByText('Hotel Vector Two')).toBeInTheDocument();
    });
  });

  test('displays error message when no hotels are found', async () => {
    (HotelService.semanticSearch as jest.Mock).mockResolvedValue({
      data: { hotelsVectorResult: [], hotelsIAResult: [], promptResultContent: '' },
      success: true,
      message: '',
      errors: [],
      unauthorized: false,
    });

    render(<HotelSearch />);

    // Insere um termo de busca
    fireEvent.change(screen.getByPlaceholderText(/buscar/i), { target: { value: 'Unknown Hotel' } });

    // Submete o formulário
    fireEvent.submit(screen.getByRole('button', { name: /buscar/i }));

    // Verifica se a mensagem de erro foi exibida
    await waitFor(() => {
      expect(screen.getByText('Nenhum hotel foi localizado com o critério digitado.')).toBeInTheDocument();
    });
  });

  test('displays error message on search failure', async () => {
    (HotelService.semanticSearch as jest.Mock).mockRejectedValue(new Error('Search Error'));

    render(<HotelSearch />);

    // Insere um termo de busca
    fireEvent.change(screen.getByPlaceholderText(/buscar/i), { target: { value: 'Error Hotel' } });

    // Submete o formulário
    fireEvent.submit(screen.getByRole('button', { name: /buscar/i }));

    // Verifica se a mensagem de erro foi exibida
    await waitFor(() => {
      expect(screen.getByText('Ocorreu um erro ao buscar os hotéis. Por favor, tente novamente.')).toBeInTheDocument();
    });
  });
});
