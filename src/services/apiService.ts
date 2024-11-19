import axios from 'axios';
import { IAppInformation } from '../interfaces/IAppInformation';
 
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + '/AppInformationVersionProduct/v1', 
});

export const getAppInformationVersionProduct = async (): Promise<IAppInformation[]> => {
  const response = await api.get<IAppInformation[]>('/GetAppInformationVersionProduct');
  return response.data;
};
