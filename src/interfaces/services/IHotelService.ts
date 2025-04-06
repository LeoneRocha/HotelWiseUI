import { IServiceResponse } from "../GeneralInterfaces"; 
import { IHotel } from "../model/Hotel/IHotel";
import { IHotelSemanticResult } from "../model/Hotel/IHotelSemanticResult";
import { ISearchCriteria } from "../model/IA/ISearchCriteria";
   export interface IHotelService {
  getAll(): Promise<IHotel[]>;
  getById(id: number): Promise<IHotel>;
  create(item: IHotel): Promise<void>;
  update(id: number, item: IHotel): Promise<void>;
  delete(id: number): Promise<void>;
  addVectorById(id: number): Promise<IHotel>;
  semanticSearch(criteria: ISearchCriteria): Promise<IServiceResponse<IHotelSemanticResult>>;
  generateHotelByIA(): Promise<IHotel>;
  getTags(): Promise<string[]>;
}

