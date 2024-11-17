import axios from 'axios';

interface AskAssistantResponse {
  response: string;
}

// Criação da instância Axios
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/Assistant/v1/ask',
});

// Interceptor para adicionar o token de autenticação
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Função do serviço
export const getChatCompletion = async (criteria: { maxHotelRetrieve: number; searchTextCriteria: string }): Promise<AskAssistantResponse[]> => {
  const response = await api.post<AskAssistantResponse[]>('/', criteria);
  return response.data;
};
