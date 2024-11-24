import axios from 'axios';
import { IAppInformation } from '../interfaces/IAppInformation';
import { EnvironmentService } from './EnvironmentService';

export const api_appInformationService = axios.create({
  baseURL: EnvironmentService.getApiBaseUrl() + '/AppInformationVersionProduct/v1',
});

export const getAppInformationVersionProduct = async (): Promise<IAppInformation[]> => {
  const response = await api_appInformationService.get<IAppInformation[]>('/GetAppInformationVersionProduct');
  return response.data;
};
