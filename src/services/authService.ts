import axios from 'axios';
import { GetUserAuthenticatedDto, ServiceResponse, UserLoginDto } from '../interfaces/authTypes';
import { EnvironmentService } from './EnvironmentService';

const api = axios.create({
  baseURL: EnvironmentService.getApiBaseUrl() + '/Auth/v1/Authenticate/',
});


export const authenticate = async (loginData: UserLoginDto): Promise<ServiceResponse<GetUserAuthenticatedDto>> => {
  const response = await api.post<ServiceResponse<GetUserAuthenticatedDto>>('/', loginData);
  return response.data;
};
