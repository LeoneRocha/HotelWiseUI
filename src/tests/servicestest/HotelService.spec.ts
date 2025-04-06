import MockAdapter from 'axios-mock-adapter';
import HotelService from '../../services/hotel/hotelService';

import { IHotel } from '../../interfaces/IHotel';
import { ISearchCriteria } from '../../interfaces/ISearchCriteria';
import { IHotelSemanticResult } from '../../interfaces/IHotelSemanticResult';
import { IServiceResponse } from '../../interfaces/IAuthTypes';

// Constantes para os endpoints
const ENDPOINTS = {
  getAll: '/Hotels/v1',
  getById: (id: number) => `/Hotels/v1/${id}`,
  create: '/Hotels/v1',
  update: (id: number) => `/Hotels/v1/${id}`,
  delete: (id: number) => `/Hotels/v1/${id}`,
  addVectorById: (id: number) => `/Hotels/v1/addvector/${id}`,
  semanticSearch: '/Hotels/v1/semanticsearch',
  generateByIA: '/Hotels/v1/generate',
  getTags: '/Hotels/v1/tags',
};

// Mensagem de erro padrão
const STATUS_RESULT_ERROR_500: string = 'Request failed with status code 500';

describe('HotelService', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(HotelService['api']);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  test('should fetch all hotels successfully', async () => {
    const mockData: IServiceResponse<IHotel[]> = {
      data: [
        {
          hotelId: 1,
          hotelName: 'Hotel One',
          description: 'A great place to stay',
          tags: ['luxury'],
          stars: 5,
          initialRoomPrice: 200,
          zipCode: '12345',
          location: 'Center',
          city: 'Metropolis',
          stateCode: 'MP',
          score: 9.8,
          isHotelInVectorStore: true,
        },
      ],
      success: true,
      message: 'Success',
      errors: [],
      unauthorized: false,
    };

    mock.onGet(ENDPOINTS.getAll).reply(200, mockData);

    const hotels = await HotelService.getAll();

    expect(hotels).toEqual(mockData.data);
  });

  test('should handle error while fetching all hotels', async () => {
    mock.onGet(ENDPOINTS.getAll).reply(500);

    await expect(HotelService.getAll()).rejects.toThrow(STATUS_RESULT_ERROR_500);
  });

  test('should fetch a hotel by ID successfully', async () => {
    const mockData: IServiceResponse<IHotel> = {
      data: {
        hotelId: 1,
        hotelName: 'Hotel One',
        description: 'A great place to stay',
        tags: ['luxury'],
        stars: 5,
        initialRoomPrice: 200,
        zipCode: '12345',
        location: 'Center',
        city: 'Metropolis',
        stateCode: 'MP',
        score: 9.8,
        isHotelInVectorStore: true,
      },
      success: true,
      message: 'Success',
      errors: [],
      unauthorized: false,
    };

    mock.onGet(ENDPOINTS.getById(1)).reply(200, mockData);

    const hotel = await HotelService.getById(1);

    expect(hotel).toEqual(mockData.data);
  });

  test('should handle error while fetching a hotel by ID', async () => {
    mock.onGet(ENDPOINTS.getById(1)).reply(500);

    await expect(HotelService.getById(1)).rejects.toThrow(STATUS_RESULT_ERROR_500);
  });

  test('should add vector by ID successfully', async () => {
    const mockData: IServiceResponse<IHotel> = {
      data: {
        hotelId: 1,
        hotelName: 'Hotel One',
        description: 'A great place to stay',
        tags: ['luxury'],
        stars: 5,
        initialRoomPrice: 200,
        zipCode: '12345',
        location: 'Center',
        city: 'Metropolis',
        stateCode: 'MP',
        score: 9.8,
        isHotelInVectorStore: true,
      },
      success: true,
      message: 'Success',
      errors: [],
      unauthorized: false,
    };

    mock.onGet(ENDPOINTS.addVectorById(1)).reply(200, mockData);

    const hotel = await HotelService.addVectorById(1);

    expect(hotel).toEqual(mockData.data);
  });

  test('should handle error while adding vector by ID', async () => {
    mock.onGet(ENDPOINTS.addVectorById(1)).reply(500);

    await expect(HotelService.addVectorById(1)).rejects.toThrow(STATUS_RESULT_ERROR_500);
  });

  test('should create a hotel successfully', async () => {
    const mockData: IServiceResponse<void> = {
      data: undefined,
      success: true,
      message: 'Hotel created successfully',
      errors: [],
      unauthorized: false,
    };

    const hotel: IHotel = {
      hotelId: 1,
      hotelName: 'Hotel One',
      description: 'A great place to stay',
      tags: ['luxury'],
      stars: 5,
      initialRoomPrice: 200,
      zipCode: '12345',
      location: 'Center',
      city: 'Metropolis',
      stateCode: 'MP',
      score: 9.8,
      isHotelInVectorStore: true,
    };

    mock.onPost(ENDPOINTS.create).reply(200, mockData);

    await expect(HotelService.create(hotel)).resolves.toBeUndefined();
  });

  test('should handle error while creating a hotel', async () => {
    const hotel: IHotel = {
      hotelId: 1,
      hotelName: 'Hotel One',
      description: 'A great place to stay',
      tags: ['luxury'],
      stars: 5,
      initialRoomPrice: 200,
      zipCode: '12345',
      location: 'Center',
      city: 'Metropolis',
      stateCode: 'MP',
      score: 9.8,
      isHotelInVectorStore: true,
    };

    mock.onPost(ENDPOINTS.create).reply(500);

    await expect(HotelService.create(hotel)).rejects.toThrow(STATUS_RESULT_ERROR_500);
  });

  test('should delete a hotel successfully', async () => {
    const mockData: IServiceResponse<void> = {
      data: undefined,
      success: true,
      message: 'Hotel deleted successfully',
      errors: [],
      unauthorized: false,
    };

    mock.onDelete(ENDPOINTS.delete(1)).reply(200, mockData);

    await expect(HotelService.delete(1)).resolves.toBeUndefined();
  });

  test('should handle error while deleting a hotel', async () => {
    mock.onDelete(ENDPOINTS.delete(1)).reply(500);

    await expect(HotelService.delete(1)).rejects.toThrow(STATUS_RESULT_ERROR_500);
  });

  test('should perform semantic search successfully', async () => {
    const mockData: IServiceResponse<IHotelSemanticResult> = {
      data: {
        hotelsVectorResult: [
          {
            hotelId: 1,
            hotelName: 'Hotel One',
            description: 'A great place to stay',
            tags: ['luxury'],
            stars: 5,
            initialRoomPrice: 200,
            zipCode: '12345',
            location: 'Center',
            city: 'Metropolis',
            stateCode: 'MP',
            score: 9.8,
            isHotelInVectorStore: true,
          },
        ],
        hotelsIAResult: [],
        promptResultContent: '',
      },
      success: true,
      message: 'Success',
      errors: [],
      unauthorized: false,
    };

    const criteria: ISearchCriteria = { maxHotelRetrieve: 5, searchTextCriteria: 'example', tagsCriteria: [] };

    mock.onPost(ENDPOINTS.semanticSearch).reply(200, mockData);

    const searchResult = await HotelService.semanticSearch(criteria);

    expect(searchResult).toEqual(mockData);
  });

  test('should handle error while performing semantic search', async () => {
    const criteria: ISearchCriteria = { maxHotelRetrieve: 5, searchTextCriteria: 'example', tagsCriteria: [] };

    mock.onPost(ENDPOINTS.semanticSearch).reply(500);

    await expect(HotelService.semanticSearch(criteria)).rejects.toThrow(STATUS_RESULT_ERROR_500);
  });
  test('should generate hotel by IA successfully', async () => {
    const mockData: IServiceResponse<IHotel> = {
      data: {
        hotelId: 1,
        hotelName: 'Hotel One',
        description: 'A great place to stay',
        tags: ['luxury'],
        stars: 5,
        initialRoomPrice: 200,
        zipCode: '12345',
        location: 'Center',
        city: 'Metropolis',
        stateCode: 'MP',
        score: 9.8,
        isHotelInVectorStore: true,
      },
      success: true,
      message: 'Success',
      errors: [],
      unauthorized: false,
    };

    mock.onGet(ENDPOINTS.generateByIA).reply(200, mockData);

    const hotel = await HotelService.generateHotelByIA();

    expect(hotel).toEqual(mockData.data);
  });

  test('should handle error while generating hotel by IA', async () => {
    mock.onGet(ENDPOINTS.generateByIA).reply(500);

    await expect(HotelService.generateHotelByIA()).rejects.toThrow(STATUS_RESULT_ERROR_500);
  });

  test('should fetch tags successfully', async () => {
    const mockData: string[] = ['Tag1', 'Tag2', 'Tag3'];

    mock.onGet(ENDPOINTS.getTags).reply(200, mockData);

    const tags = await HotelService.getTags();

    expect(tags).toEqual(mockData);
  });

  test('should handle error while fetching tags', async () => {
    mock.onGet(ENDPOINTS.getTags).reply(500);

    await expect(HotelService.getTags()).rejects.toThrow();
  });
});
