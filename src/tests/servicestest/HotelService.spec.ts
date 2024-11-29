
import MockAdapter from 'axios-mock-adapter';
import HotelService, { api_hotelservice } from '../../services/hotelService';

import { IHotel } from '../../interfaces/IHotel';
import { ISearchCriteria } from '../../interfaces/ISearchCriteria';
import { IHotelSemanticResult } from '../../interfaces/IHotelSemanticResult';
import { IServiceResponse } from '../../interfaces/IAuthTypes';


describe('HotelService', () => {
  let mock: MockAdapter;

  beforeAll(() => {
    mock = new MockAdapter(api_hotelservice);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  test('should fetch all hotels successfully', async () => {
    const mockData: IServiceResponse<IHotel[]> = {
      data: [{ hotelId: 1, hotelName: 'Hotel One', description: 'A great place to stay', tags: ['luxury'], stars: 5, initialRoomPrice: 200, zipCode: '12345', location: 'Center', city: 'Metropolis', stateCode: 'MP', score: 9.8, isHotelInVectorStore: true }],
      success: true,
      message: 'Success',
      errors: [],
      unauthorized: false,
    };

    mock.onGet('/').reply(200, mockData);

    const hotels = await HotelService.getAllHotels();

    expect(hotels).toEqual(mockData.data);
  });

  test('should handle error while fetching all hotels', async () => {
    mock.onGet('/').reply(500);

    await expect(HotelService.getAllHotels()).rejects.toThrow('Request failed with status code 500');
  });

  test('should fetch a hotel by ID successfully', async () => {
    const mockData: IServiceResponse<IHotel> = {
      data: { hotelId: 1, hotelName: 'Hotel One', description: 'A great place to stay', tags: ['luxury'], stars: 5, initialRoomPrice: 200, zipCode: '12345', location: 'Center', city: 'Metropolis', stateCode: 'MP', score: 9.8, isHotelInVectorStore: true },
      success: true,
      message: 'Success',
      errors: [],
      unauthorized: false,
    };

    mock.onGet('/1').reply(200, mockData);

    const hotel = await HotelService.getHotelById(1);

    expect(hotel).toEqual(mockData.data);
  });

  test('should handle error while fetching a hotel by ID', async () => {
    mock.onGet('/1').reply(500);

    await expect(HotelService.getHotelById(1)).rejects.toThrow('Request failed with status code 500');
  });

  test('should add vector by ID successfully', async () => {
    const mockData: IServiceResponse<IHotel> = {
      data: { hotelId: 1, hotelName: 'Hotel One', description: 'A great place to stay', tags: ['luxury'], stars: 5, initialRoomPrice: 200, zipCode: '12345', location: 'Center', city: 'Metropolis', stateCode: 'MP', score: 9.8, isHotelInVectorStore: true },
      success: true,
      message: 'Success',
      errors: [],
      unauthorized: false,
    };

    mock.onGet('/addvector/1').reply(200, mockData);

    const hotel = await HotelService.addVectorById(1);

    expect(hotel).toEqual(mockData.data);
  });

  test('should handle error while adding vector by ID', async () => {
    mock.onGet('/addvector/1').reply(500);

    await expect(HotelService.addVectorById(1)).rejects.toThrow('Request failed with status code 500');
  });

  test('should create a hotel successfully', async () => {
    const mockData: IServiceResponse<void> = {
      data: undefined,
      success: true,
      message: 'Hotel created successfully',
      errors: [],
      unauthorized: false,
    };

    const hotel: IHotel = { hotelId: 1, hotelName: 'Hotel One', description: 'A great place to stay', tags: ['luxury'], stars: 5, initialRoomPrice: 200, zipCode: '12345', location: 'Center', city: 'Metropolis', stateCode: 'MP', score: 9.8, isHotelInVectorStore: true };

    mock.onPost('/').reply(200, mockData);

    await expect(HotelService.createHotel(hotel)).resolves.toBeUndefined();
  });

  test('should handle error while creating a hotel', async () => {
    const hotel: IHotel = { hotelId: 1, hotelName: 'Hotel One', description: 'A great place to stay', tags: ['luxury'], stars: 5, initialRoomPrice: 200, zipCode: '12345', location: 'Center', city: 'Metropolis', stateCode: 'MP', score: 9.8, isHotelInVectorStore: true };

    mock.onPost('/').reply(500);

    await expect(HotelService.createHotel(hotel)).rejects.toThrow('Request failed with status code 500');
  });

  test('should update a hotel successfully', async () => {
    const mockData: IServiceResponse<void> = {
      data: undefined,
      success: true,
      message: 'Hotel updated successfully',
      errors: [],
      unauthorized: false,
    };

    const hotel: IHotel = { hotelId: 1, hotelName: 'Hotel One', description: 'A great place to stay', tags: ['luxury'], stars: 5, initialRoomPrice: 200, zipCode: '12345', location: 'Center', city: 'Metropolis', stateCode: 'MP', score: 9.8, isHotelInVectorStore: true };

    mock.onPut('/1').reply(200, mockData);

    await expect(HotelService.updateHotel(1, hotel)).resolves.toBeUndefined();
  });

  test('should handle error while updating a hotel', async () => {
    const hotel: IHotel = { hotelId: 1, hotelName: 'Hotel One', description: 'A great place to stay', tags: ['luxury'], stars: 5, initialRoomPrice: 200, zipCode: '12345', location: 'Center', city: 'Metropolis', stateCode: 'MP', score: 9.8, isHotelInVectorStore: true };

    mock.onPut('/1').reply(500);

    await expect(HotelService.updateHotel(1, hotel)).rejects.toThrow('Request failed with status code 500');
  });

  test('should delete a hotel successfully', async () => {
    const mockData: IServiceResponse<void> = {
      data: undefined,
      success: true,
      message: 'Hotel deleted successfully',
      errors: [],
      unauthorized: false,
    };

    mock.onDelete('/1').reply(200, mockData);

    await expect(HotelService.deleteHotel(1)).resolves.toBeUndefined();
  });

  test('should handle error while deleting a hotel', async () => {
    mock.onDelete('/1').reply(500);

    await expect(HotelService.deleteHotel(1)).rejects.toThrow('Request failed with status code 500');
  });

  test('should perform semantic search successfully', async () => {
    const mockData: IServiceResponse<IHotelSemanticResult> = {
      data: {
        hotelsVectorResult: [{ hotelId: 1, hotelName: 'Hotel One', description: 'A great place to stay', tags: ['luxury'], stars: 5, initialRoomPrice: 200, zipCode: '12345', location: 'Center', city: 'Metropolis', stateCode: 'MP', score: 9.8, isHotelInVectorStore: true }],
        hotelsIAResult: [],
        promptResultContent: ''
      },
      success: true,
      message: 'Success',
      errors: [],
      unauthorized: false,
    };

    const criteria: ISearchCriteria = { maxHotelRetrieve: 5, searchTextCriteria: 'example', tagsCriteria: [] };

    mock.onPost('/semanticsearch').reply(200, mockData);

    const searchResult = await HotelService.semanticSearch(criteria);

    expect(searchResult).toEqual(mockData);
  });

  test('should handle error while performing semantic search', async () => {
    const criteria: ISearchCriteria = { maxHotelRetrieve: 5, searchTextCriteria: 'example', tagsCriteria: [] };

    mock.onPost('/semanticsearch').reply(500);

    await expect(HotelService.semanticSearch(criteria)).rejects.toThrow('Request failed with status code 500');
  });

  test('should generate hotel by IA successfully', async () => {
    const mockData: IServiceResponse<IHotel> = {
      data: { hotelId: 1, hotelName: 'Hotel One', description: 'A great place to stay', tags: ['luxury'], stars: 5, initialRoomPrice: 200, zipCode: '12345', location: 'Center', city: 'Metropolis', stateCode: 'MP', score: 9.8, isHotelInVectorStore: true },
      success: true,
      message: 'Success',
      errors: [],
      unauthorized: false,
    };

    mock.onGet('/generate').reply(200, mockData);

    const hotel = await HotelService.generateHotelByIA();

    expect(hotel).toEqual(mockData.data);
  });

  test('should handle error while generating hotel by IA', async () => {
    mock.onGet('/generate').reply(500);

    await expect(HotelService.generateHotelByIA()).rejects.toThrow('Request failed with status code 500');
  });

  test('should fetch tags successfully', async () => {
    const mockData: string[] = ['Tag1', 'Tag2', 'Tag3'];

    mock.onGet('/tags').reply(200, mockData);

    const tags = await HotelService.getTags();

    expect(tags).toEqual(mockData);
  });

  test('should handle error while fetching tags', async () => {
    mock.onGet('/tags').reply(500);

    await expect(HotelService.getTags()).rejects.toThrow();
  });
});
