// services/AssistantService.ts
import axios from 'axios';
import { IAskAssistantResponse } from '../interfaces/IAskAssistantResponse';
import { EnvironmentService } from './EnvironmentService'; 
import { IAssistantService } from '../interfaces/services/IAssistantService';

// Criação da instância Axios
export const api_assistantService = axios.create({
  baseURL: EnvironmentService.getApiBaseUrl() + '/Assistant/v1/ask',
});

// Interceptor para adicionar o token de autenticação
api_assistantService.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class AssistantService implements IAssistantService {
  async getChatCompletion(criteria: { maxHotelRetrieve: number; searchTextCriteria: string }): Promise<IAskAssistantResponse[]> {
    const response = await api_assistantService.post<IAskAssistantResponse[]>('/', criteria);
    return response.data;
  }
}

export default new AssistantService();
