import axios from 'axios';
import { IHotel } from '../interfaces/IHotel';


const api = axios.create({
  baseURL: 'https://localhost:7203/api/Hotels/v1',
});

export const getAllHotels = async (): Promise<IHotel[]> => {
  const response = await api.get<IHotel[]>('/');
  return response.data;
};

export const getHotelById = async (id: number): Promise<IHotel> => {
  const response = await api.get<IHotel>(`/${id}`);
  return response.data;
};

export const createHotel = async (hotel: IHotel): Promise<void> => {
  await api.post('/', hotel);
};

export const updateHotel = async (id: number, hotel: IHotel): Promise<void> => {
  await api.put(`/${id}`, hotel);
};

export const deleteHotel = async (id: number): Promise<void> => {
  await api.delete(`/${id}`);
};

export const semanticSearch = async (criteria: { maxHotelRetrive: number; searchTextCriteria: string }): Promise<IHotel[]> => {
  const response = await api.post('/semanticsearch', criteria); return response.data;
};