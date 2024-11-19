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

interface ServiceResponse<T> {
  data: T;
  success: boolean;
  message: string;
  errors: { name: string; message: string; errorCode: string }[];
  unauthorized: boolean;
}

// Funções do serviço
export const getAllHotels = async (): Promise<IHotel[]> => {
  const response = await api.get<ServiceResponse<IHotel[]>>('/');
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Erro ao buscar hotéis');
  }
};

export const getHotelById = async (id: number): Promise<IHotel> => {
  const response = await api.get<ServiceResponse<IHotel>>(`/${id}`);
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Erro ao buscar hotel');
  }
};

export const adVectorById = async (id: number): Promise<IHotel> => {
  const response = await api.get<ServiceResponse<IHotel>>(`/addvector/${id}`);
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Erro ao adicionar vetor');
  }
};

export const createHotel = async (hotel: IHotel): Promise<void> => {
  const response = await api.post<ServiceResponse<void>>('/', hotel);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Erro ao criar hotel');
  }
};

export const updateHotel = async (id: number, hotel: IHotel): Promise<void> => {
  const response = await api.put<ServiceResponse<void>>(`/${id}`, hotel);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Erro ao atualizar hotel');
  }
};

export const deleteHotel = async (id: number): Promise<void> => {
  const response = await api.delete<ServiceResponse<void>>(`/${id}`);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Erro ao deletar hotel');
  }
};

export const semanticSearch = async (criteria: { maxHotelRetrieve: number; searchTextCriteria: string }): Promise<IHotel[]> => {
  const response = await api.post<ServiceResponse<IHotel[]>>('/semanticsearch', criteria);
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Erro na busca semântica');
  }
};

export const generateHotelByIA = async (): Promise<IHotel> => {
  const response = await api.get<ServiceResponse<IHotel>>('/generate');
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Erro ao gerar hotel por IA');
  }
};
