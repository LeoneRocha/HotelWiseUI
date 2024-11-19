class LocalStorageService {
    /**
     * Salva um item no localStorage.
     * @param key A chave do item.
     * @param value O valor do item.
     */
    static setItem(key: string, value: string): void {
      localStorage.setItem(key, value);
    }
  
    /**
     * Recupera um item do localStorage.
     * @param key A chave do item.
     * @returns O valor do item ou null se a chave não existir.
     */
    static getItem(key: string): string | null {
      return localStorage.getItem(key);
    }
  
    /**
     * Remove um item do localStorage.
     * @param key A chave do item.
     */
    static removeItem(key: string): void {
      localStorage.removeItem(key);
    }
  
    /**
     * Verifica se um item existe no localStorage.
     * @param key A chave do item.
     * @returns True se o item existir, false caso contrário.
     */
    static hasItem(key: string): boolean {
      return localStorage.getItem(key) !== null;
    }
  
    /**
     * Limpa todos os itens do localStorage.
     */
    static clear(): void {
      localStorage.clear();
    }
  }
  
  export default LocalStorageService;
  