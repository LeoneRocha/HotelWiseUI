// services/AuthenticateService.ts
import axios from 'axios';
import { IGetUserAuthenticatedDto, IServiceResponse, IUserLoginDto } from '../interfaces/IAuthTypes';
import EnvironmentService from './EnvironmentService';
import { IAuthenticateService } from '../interfaces/services/IAuthenticateService';
import { nameStorageTokenJWT } from '../auth-config';

// Criação da instância Axios
export const api_Authenticate = axios.create({
  baseURL: EnvironmentService.getApiBaseUrl() + '/Auth/v1/Authenticate/',
});

// Interceptor para adicionar o token de autenticação
api_Authenticate.interceptors.request.use((config) => {
  const token = localStorage.getItem(nameStorageTokenJWT);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

class AuthenticateService implements IAuthenticateService {
  async authenticate(loginData: IUserLoginDto): Promise<IServiceResponse<IGetUserAuthenticatedDto>> {
    const response = await api_Authenticate.post<IServiceResponse<IGetUserAuthenticatedDto>>('/', loginData);
    return response.data;
  }
}

export default new AuthenticateService();
