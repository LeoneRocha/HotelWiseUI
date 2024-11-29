import axios from 'axios';
import { IGetUserAuthenticatedDto, IServiceResponse, IUserLoginDto } from '../interfaces/IAuthTypes';
import { EnvironmentService } from './EnvironmentService';

export const api_Authenticate = axios.create({
  baseURL: EnvironmentService.getApiBaseUrl() + '/Auth/v1/Authenticate/',
});


export const authenticate = async (loginData: IUserLoginDto): Promise<IServiceResponse<IGetUserAuthenticatedDto>> => {
  const response = await api_Authenticate.post<IServiceResponse<IGetUserAuthenticatedDto>>('/', loginData);
  return response.data;
};
