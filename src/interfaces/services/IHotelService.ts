import { IServiceResponse } from "../IAuthTypes";
import { IHotel } from "../IHotel";
import { IHotelSemanticResult } from "../IHotelSemanticResult";
import { ISearchCriteria } from "../ISearchCriteria";
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

