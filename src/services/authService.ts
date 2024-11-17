import axios from 'axios';
import { GetUserAuthenticatedDto, ServiceResponse, UserLoginDto } from '../interfaces/authTypes';


const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL + '/Auth/v1/Authenticate/',
  });
 

export const authenticate = async (loginData: UserLoginDto): Promise<ServiceResponse<GetUserAuthenticatedDto>> => {
  const response = await api.post<ServiceResponse<GetUserAuthenticatedDto>>('/', loginData);
  return response.data;
};
