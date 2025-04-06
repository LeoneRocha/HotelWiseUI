import axios, { AxiosInstance } from 'axios';
import { nameStorageTokenJWT } from '../../auth-config';
import { IGenericService } from '../../interfaces/services/generic/IGenericService';
import { IServiceResponse } from '../../interfaces/IAuthTypes';

export const createApiInstance = (baseURL: string): AxiosInstance => {
  const apiInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  apiInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem(nameStorageTokenJWT);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return apiInstance;
};

export class GenericService<T> implements IGenericService<T> {
  protected api: AxiosInstance;
  protected readonly endpoint: string;

  constructor(baseURL: string, endpoint: string) {
    this.api = createApiInstance(baseURL);
    this.endpoint = endpoint;
  }

  async getAll(): Promise<T[]> {
    const response = await this.api.get<IServiceResponse<T[]>>(this.endpoint);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Erro ao buscar dados');
  }

  async getById(id: number): Promise<T> {
    const response = await this.api.get<IServiceResponse<T>>(`${this.endpoint}/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Erro ao buscar item');
  }

  async create(item: T): Promise<void> {
    const response = await this.api.post<IServiceResponse<void>>(this.endpoint, item);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao criar item');
    }
  }

  async update(id: number, item: T): Promise<void> {
    const response = await this.api.put<IServiceResponse<void>>(`${this.endpoint}/${id}`, item);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao atualizar item');
    }
  }

  async delete(id: number): Promise<void> {
    const response = await this.api.delete<IServiceResponse<void>>(`${this.endpoint}/${id}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Erro ao deletar item');
    }
  }
}
