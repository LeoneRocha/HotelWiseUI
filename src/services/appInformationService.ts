import axios from 'axios';
import { IAppInformation } from '../interfaces/IAppInformation';
import EnvironmentService from './EnvironmentService';
import { IAppInformationService } from '../interfaces/services/IAppInformationService';

export const api_appInformationService = axios.create({
  baseURL: EnvironmentService.getApiBaseUrl() + '/AppInformationVersionProduct/v1',
});

class AppInformationService implements IAppInformationService {

  async getAppInformationVersionProduct(): Promise<IAppInformation[]> {
    const response = await api_appInformationService.get<IAppInformation[]>('/GetAppInformationVersionProduct');
    return response.data;
  }
}

export default new AppInformationService();
