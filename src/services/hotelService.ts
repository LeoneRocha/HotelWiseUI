import axios from 'axios';
import { IHotel } from '../interfaces/IHotel';

// Criação da instância Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/Hotels/v1',
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funções do serviço
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

export const semanticSearch = async (criteria: { maxHotelRetrieve: number; searchTextCriteria: string }): Promise<IHotel[]> => {
  const response = await api.post('/semanticsearch', criteria);
  return response.data;
};
export const generateHotelByIA = async (): Promise<IHotel> => {
  const response = await api.get<IHotel>('/generate');
  return response.data;
};
