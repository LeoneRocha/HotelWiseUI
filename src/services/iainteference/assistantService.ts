//AssistantService.ts
import axios from 'axios'; 
import { nameStorageTokenAzureAD, nameStorageTokenJWT } from '../../auth-config';
import { IAskAssistantResponse } from '../../interfaces/IAskAssistantResponse';
import { IAskAssistantRequest } from '../../interfaces/IAskAssistantRequest';
import { IAssistantService } from '../../interfaces/services/IAssistantService';
import EnvironmentService from '../general/EnvironmentService';

// Criação da instância Axios
export const api_assistantService = axios.create({
  baseURL: EnvironmentService.getApiBaseUrl() + '/Assistant/v1/ask',
});

// Interceptor para adicionar o token de autenticação
api_assistantService.interceptors.request.use((config) => {
  const jwtToken = localStorage.getItem(nameStorageTokenJWT);
  const azureToken = localStorage.getItem(nameStorageTokenAzureAD);

  // Adiciona o token apropriado no header Authorization
  if (azureToken) {
    //config.headers.Authorization = `AzureAd ${azureToken}`;
    //config.headers.Authorization = `Bearer ${azureToken}`;
    config.headers.Authorization = `AzureAd ${azureToken}`;
  }
  if (jwtToken) {
    config.headers.Authorization = `Bearer ${jwtToken}`;
  }

  // Logando as informações da requisição no console
  console.log('Requisição Axios:', {
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: config.data,
  });

  //ver o exemplo que fiz anterior mente e compara parece que falta o scope  
  return config;
});

class AssistantService implements IAssistantService {
  async getChatCompletion(criteria: IAskAssistantRequest): Promise<IAskAssistantResponse[]> {
    const response = await api_assistantService.post<IAskAssistantResponse[]>('/', criteria);
    console.log('Resposta da API:', response.data);
    return response.data;
  }
}

export default new AssistantService();
