import { ITechnologyResource } from '../ITechnologyResource';

export interface ITechnologyCatalogService {
  getTechnologies(): Promise<ITechnologyResource[]>;
}
