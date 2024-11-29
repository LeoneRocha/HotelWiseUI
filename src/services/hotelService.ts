// services/HotelService.ts
import axios from 'axios';
import { IHotel } from '../interfaces/IHotel';
import { IServiceResponse } from '../interfaces/IAuthTypes';
import { ISearchCriteria } from '../interfaces/ISearchCriteria';
import { IHotelSemanticResult } from '../interfaces/IHotelSemanticResult';
import EnvironmentService from './EnvironmentService'; 
import { IHotelService } from '../interfaces/services/IHotelService';

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

class HotelService implements IHotelService {
  async getAllHotels(): Promise<IHotel[]> {
    const response = await api_hotelservice.get<IServiceResponse<IHotel[]>>('/');
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erro ao buscar hotéis');
    }
  }

  async getHotelById(id: number): Promise<IHotel> {
    const response = await api_hotelservice.get<IServiceResponse<IHotel>>(`/${id}`);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erro ao buscar hotel');
    }
  }

  async addVectorById(id: number): Promise<IHotel> {
    const response = await api_hotelservice.get<IServiceResponse<IHotel>>(`/addvector/${id}`);
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erro ao adicionar vetor');
    }
  }

  async createHotel(hotel: IHotel): Promise<void> {
    const response = await api_hotelservice.post<IServiceResponse<void>>('/', hotel);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao criar hotel');
    }
  }

  async updateHotel(id: number, hotel: IHotel): Promise<void> {
    const response = await api_hotelservice.put<IServiceResponse<void>>(`/${id}`, hotel);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao atualizar hotel');
    }
  }

  async deleteHotel(id: number): Promise<void> {
    const response = await api_hotelservice.delete<IServiceResponse<void>>(`/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao deletar hotel');
    }
  }

  async semanticSearch(criteria: ISearchCriteria): Promise<IServiceResponse<IHotelSemanticResult>> {
    const response = await api_hotelservice.post<IServiceResponse<IHotelSemanticResult>>('/semanticsearch', criteria);
    if (EnvironmentService.isNotTestEnvironment()) {
      console.log(response);
    }
    if (response.data.success) {
      return response.data;
    } else {
      throw new Error(response.data.message || 'Erro na busca semântica');
    }
  }

  async generateHotelByIA(): Promise<IHotel> {
    const response = await api_hotelservice.get<IServiceResponse<IHotel>>('/generate');
    if (response.data.success) {
      return response.data.data;
    } else {
      throw new Error(response.data.message || 'Erro ao gerar hotel por IA');
    }
  }

  async getTags(): Promise<string[]> {
    const response = await api_hotelservice.get<string[]>('/tags');
    return response.data;
  }
}

export default new HotelService();
