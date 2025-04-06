import { IServiceResponse } from '../../GeneralInterfaces';

export interface IGenericService<T> {
  getAll(): Promise<IServiceResponse<T[]>>;               // Busca todos os itens
  getById(id: number): Promise<IServiceResponse<T>>;      // Busca um item pelo ID
  create(item: T): Promise<IServiceResponse<T>>;          // Cria um novo item
  update(id: number, item: T): Promise<IServiceResponse<T>>; // Atualiza um item pelo ID
  delete(id: number): Promise<IServiceResponse<string>>;  // Exclui um item pelo ID
}
