import { IHotelService } from '../../interfaces/services/hotel/IHotelService'; 
import { ISearchCriteria } from '../../interfaces/model/IA/ISearchCriteria'; 
import { GenericService } from '../Generic/GenericService';
import { IServiceResponse } from '../../interfaces/GeneralInterfaces';
import EnvironmentService from '../general/EnvironmentService';
import { IHotel } from '../../interfaces/model/Hotel/IHotel';
import { IHotelSemanticResult } from '../../interfaces/model/Hotel/IHotelSemanticResult';

const BASE_URL = EnvironmentService.getApiBaseUrl();

class HotelService extends GenericService<IHotel> implements IHotelService {
  constructor() {
    super(BASE_URL, '/Hotels/v1');
  }

  async addVectorById(id: number): Promise<IServiceResponse<IHotel>> {
    const response = await this.api.get<IServiceResponse<IHotel>>(`${this.endpoint}/addvector/${id}`);
    if (response.data.success) {
      return response.data;
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

  async generateHotelByIA(): Promise<IServiceResponse<IHotel>> {
    const response = await this.api.get<IServiceResponse<IHotel>>(`${this.endpoint}/generate`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Erro ao gerar hotel por IA');
  }

  async getTags(): Promise<IServiceResponse<string[]>> {
    const response = await this.api.get<IServiceResponse<string[]>>(`${this.endpoint}/tags`);
    if (response.data) {
      return response.data;
    }
    throw new Error('Erro ao buscar tags');
  }
}

export default new HotelService();
