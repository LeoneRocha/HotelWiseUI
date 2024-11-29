import axios from 'axios';
import { IHotel } from '../interfaces/IHotel';
import { IServiceResponse } from '../interfaces/IAuthTypes';
import { ISearchCriteria } from '../interfaces/ISearchCriteria';
import { IHotelSemanticResult } from '../interfaces/IHotelSemanticResult';
import { EnvironmentService } from './EnvironmentService';

// Criação da instância Axios
export const api_hotelservice = axios.create({
  baseURL: EnvironmentService.getApiBaseUrl() + '/Hotels/v1',
});

// Interceptor para adicionar o token de autenticação
api_hotelservice.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Funções do serviço
export const getAllHotels = async (): Promise<IHotel[]> => {
  const response = await api_hotelservice.get<IServiceResponse<IHotel[]>>('/');
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Erro ao buscar hotéis');
  }
};

export const getHotelById = async (id: number): Promise<IHotel> => {
  const response = await api_hotelservice.get<IServiceResponse<IHotel>>(`/${id}`);
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Erro ao buscar hotel');
  }
};

export const addVectorById = async (id: number): Promise<IHotel> => {
  const response = await api_hotelservice.get<IServiceResponse<IHotel>>(`/addvector/${id}`);
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Erro ao adicionar vetor');
  }
};

export const createHotel = async (hotel: IHotel): Promise<void> => {
  const response = await api_hotelservice.post<IServiceResponse<void>>('/', hotel);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Erro ao criar hotel');
  }
};

export const updateHotel = async (id: number, hotel: IHotel): Promise<void> => {
  const response = await api_hotelservice.put<IServiceResponse<void>>(`/${id}`, hotel);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Erro ao atualizar hotel');
  }
};

export const deleteHotel = async (id: number): Promise<void> => {
  const response = await api_hotelservice.delete<IServiceResponse<void>>(`/${id}`);
  if (!response.data.success) {
    throw new Error(response.data.message || 'Erro ao deletar hotel');
  }
};

// Função de busca semântica
export const semanticSearch = async (criteria: ISearchCriteria): Promise<IServiceResponse<IHotelSemanticResult>> => {
  const response = await api_hotelservice.post<IServiceResponse<IHotelSemanticResult>>('/semanticsearch', criteria);
  if (EnvironmentService.isNotTestEnvironment()) {
    console.log(response);
  }
  if (response.data.success) {
    return response.data;
  } else {
    throw new Error(response.data.message || 'Erro na busca semântica');
  }
};

export const generateHotelByIA = async (): Promise<IHotel> => {
  const response = await api_hotelservice.get<IServiceResponse<IHotel>>('/generate');
  if (response.data.success) {
    return response.data.data;
  } else {
    throw new Error(response.data.message || 'Erro ao gerar hotel por IA');
  }
};

export const getTags = async (): Promise<string[]> => {
  const response = await api_hotelservice.get<string[]>('/tags');
  return response.data;
};
