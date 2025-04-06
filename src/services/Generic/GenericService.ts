import axios, { AxiosInstance } from 'axios';
import { nameStorageTokenJWT } from '../../auth-config';
import { IGenericService } from '../../interfaces/services/generic/IGenericService';
import { IServiceResponse } from '../../interfaces/GeneralInterfaces';

// Função para criar instância do Axios
export const createApiInstance = (baseURL: string): AxiosInstance => {
  const apiInstance = axios.create({
    baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Adiciona interceptador para incluir o token JWT
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
  protected api: AxiosInstance; // Instância do Axios
  protected readonly endpoint: string; // Endpoint específico para a entidade

  constructor(baseURL: string, endpoint: string) {
    this.api = createApiInstance(baseURL);
    this.endpoint = endpoint;
  }

  // Busca todos os itens
  async getAll(): Promise<IServiceResponse<T[]>> {
    const response = await this.api.get<IServiceResponse<T[]>>(this.endpoint);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Erro ao buscar dados');
  }

  // Busca item pelo ID
  async getById(id: number): Promise<IServiceResponse<T>> {
    const response = await this.api.get<IServiceResponse<T>>(`${this.endpoint}/${id}`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Erro ao buscar item');
  }

  // Cria um novo item
  async create(item: T): Promise<IServiceResponse<T>> {
    const response = await this.api.post<IServiceResponse<T>>(this.endpoint, item);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Erro ao criar item');
  }

  // Atualiza um item pelo ID
  async update(id: number, item: T): Promise<IServiceResponse<T>> {
    const response = await this.api.put<IServiceResponse<T>>(`${this.endpoint}/${id}`, item);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Erro ao atualizar item');
  }

  // Exclui um item pelo ID
  async delete(id: number): Promise<IServiceResponse<string>> {
    const response = await this.api.delete<IServiceResponse<string>>(`${this.endpoint}/${id}`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Erro ao deletar item');
  }
}
