import { IServiceResponse } from "../../GeneralInterfaces"; 
import { IHotel } from "../../model/Hotel/IHotel";
import { IHotelSemanticResult } from "../../model/Hotel/IHotelSemanticResult";
import { ISearchCriteria } from "../../model/IA/ISearchCriteria";

export interface IHotelService {
  getAll(): Promise<IServiceResponse<IHotel[]>>;                // Busca todos os hotéis
  getById(id: number): Promise<IServiceResponse<IHotel>>;       // Busca hotel pelo ID
  create(item: IHotel): Promise<IServiceResponse<IHotel>>;      // Cria um novo hotel
  update(id: number, item: IHotel): Promise<IServiceResponse<IHotel>>; // Atualiza um hotel pelo ID
  delete(id: number): Promise<IServiceResponse<string>>;        // Exclui um hotel pelo ID
  addVectorById(id: number): Promise<IServiceResponse<IHotel>>; // Adiciona hotel ao vetor
  semanticSearch(criteria: ISearchCriteria): Promise<IServiceResponse<IHotelSemanticResult>>; // Busca semântica
  generateHotelByIA(): Promise<IServiceResponse<IHotel>>;       // Gera hotel com IA
  getTags(): Promise<IServiceResponse<string[]>>;               // Busca tags
}
