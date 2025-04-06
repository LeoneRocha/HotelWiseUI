 
import { IHotelService } from '../interfaces/services/IHotelService';
import { IHotel } from '../interfaces/IHotel'; 
import { ISearchCriteria } from '../interfaces/ISearchCriteria';
import { IHotelSemanticResult } from '../interfaces/IHotelSemanticResult';
import EnvironmentService from './EnvironmentService';
import { GenericService } from './Generic/GenericService';
import { IServiceResponse } from '../interfaces/IAuthTypes';

const BASE_URL = EnvironmentService.getApiBaseUrl();

class HotelService extends GenericService<IHotel> implements IHotelService {
  constructor() {
    super(BASE_URL, '/Hotels/v1');
  }

  async addVectorById(id: number): Promise<IHotel> {
    const response = await this.api.get<IServiceResponse<IHotel>>(`${this.endpoint}/addvector/${id}`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Erro ao adicionar vetor');
  }

  async semanticSearch(criteria: ISearchCriteria): Promise<IServiceResponse<IHotelSemanticResult>> {
    const response = await this.api.post<IServiceResponse<IHotelSemanticResult>>(`${this.endpoint}/semanticsearch`, criteria);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Erro na busca semântica');
  }

  async generateHotelByIA(): Promise<IHotel> {
    const response = await this.api.get<IServiceResponse<IHotel>>(`${this.endpoint}/generate`);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.message || 'Erro ao gerar hotel por IA');
  }

  async getTags(): Promise<string[]> {
    const response = await this.api.get<string[]>(`${this.endpoint}/tags`);
    return response.data;
  }
}

export default new HotelService();
