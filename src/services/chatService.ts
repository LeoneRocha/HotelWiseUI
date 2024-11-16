import axios from 'axios';

interface AskAssistantResponse {
  response: string;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + '/Assistant/v1/ask',
});

export const getChatCompletion = async (criteria: { maxHotelRetrieve: number; searchTextCriteria: string }): Promise<AskAssistantResponse[]> => {
  const response = await api.post<AskAssistantResponse[]>('/', criteria);
  return response.data;
};
