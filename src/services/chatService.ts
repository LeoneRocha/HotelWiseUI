import axios from 'axios';
import { AskAssistantResponse } from '../interfaces/AskAssistantResponse';
import { EnvironmentService } from './EnvironmentService';
 
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

// Função do serviço
export const getChatCompletion = async (criteria: { maxHotelRetrieve: number; searchTextCriteria: string }): Promise<AskAssistantResponse[]> => {
  const response = await api_assistantService.post<AskAssistantResponse[]>('/', criteria);
  return response.data;
};
