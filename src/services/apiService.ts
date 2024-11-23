import axios from 'axios';
import { IAppInformation } from '../interfaces/IAppInformation';
import { EnvironmentService } from './EnvironmentService';

const api = axios.create({
    baseURL: EnvironmentService.getApiBaseUrl() + '/AppInformationVersionProduct/v1',
});

export const getAppInformationVersionProduct = async (): Promise<IAppInformation[]> => {
  const response = await api.get<IAppInformation[]>('/GetAppInformationVersionProduct');
  return response.data;
};
