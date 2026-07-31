import { ITechnologyResource } from '../interfaces/ITechnologyResource';
import { ITechnologyCatalogService } from '../interfaces/services/ITechnologyCatalogService';
import EnvironmentService from './general/EnvironmentService';

/**
 * Catálogo de tecnologias do footer.
 * Hoje: lê `VITE_TECHNOLOGIES_JSON` do .env (development/production).
 * Depois: trocar `getTechnologies()` para GET em API externa.
 */
class TechnologyCatalogService implements ITechnologyCatalogService {
  async getTechnologies(): Promise<ITechnologyResource[]> {
    // TODO: substituir por chamada HTTP (ex.: `${EnvironmentService.getApiBaseUrl()}/technologies`)
    return this.getFromEnvironment();
  }

  private getFromEnvironment(): ITechnologyResource[] {
    const raw = process.env.VITE_TECHNOLOGIES_JSON;
    if (!raw) {
      return [];
    }

    try {
      const parsed = JSON.parse(raw) as ITechnologyResource[];
      if (!Array.isArray(parsed)) {
        throw new Error('VITE_TECHNOLOGIES_JSON deve ser um array JSON');
      }
      return parsed;
    } catch (error) {
      if (EnvironmentService.isNotTestEnvironment()) {
        console.error('Erro ao interpretar VITE_TECHNOLOGIES_JSON:', error);
      }
      return [];
    }
  }
}

export default new TechnologyCatalogService();
