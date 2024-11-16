import axios from 'axios';

export interface IAppInformation {
  id: string;
  name: string;
  version: string;
  environmentName: string;
  message: string;
}

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + '/AppInformationVersionProduct/v1', 
});

export const getAppInformationVersionProduct = async (): Promise<IAppInformation[]> => {
  const response = await api.get<IAppInformation[]>('/GetAppInformationVersionProduct');
  return response.data;
};
