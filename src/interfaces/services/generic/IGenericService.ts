export interface IGenericService<T> {
    getAll(): Promise<T[]>;                  // Busca todos os itens
    getById(id: number): Promise<T>;         // Busca item pelo ID
    create(item: T): Promise<void>;          // Cria um novo item
    update(id: number, item: T): Promise<void>; // Atualiza um item existente
    delete(id: number): Promise<void>;       // Remove um item pelo ID
  }
  