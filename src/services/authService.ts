import axios from 'axios';
import { GetUserAuthenticatedDto, ServiceResponse, UserLoginDto } from '../interfaces/authTypes';
import { EnvironmentService } from './EnvironmentService';

export const api_Authenticate = axios.create({
  baseURL: EnvironmentService.getApiBaseUrl() + '/Auth/v1/Authenticate/',
});


export const authenticate = async (loginData: UserLoginDto): Promise<ServiceResponse<GetUserAuthenticatedDto>> => {
  const response = await api_Authenticate.post<ServiceResponse<GetUserAuthenticatedDto>>('/', loginData);
  return response.data;
};
