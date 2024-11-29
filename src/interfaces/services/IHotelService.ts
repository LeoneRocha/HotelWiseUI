import { IServiceResponse } from "../IAuthTypes";
import { IHotel } from "../IHotel";
import { IHotelSemanticResult } from "../IHotelSemanticResult";
import { ISearchCriteria } from "../ISearchCriteria";

// interfaces/IHotelService.ts 
export interface IHotelService {
  getAllHotels(): Promise<IHotel[]>;
  getHotelById(id: number): Promise<IHotel>;
  addVectorById(id: number): Promise<IHotel>;
  createHotel(hotel: IHotel): Promise<void>;
  updateHotel(id: number, hotel: IHotel): Promise<void>;
  deleteHotel(id: number): Promise<void>;
  semanticSearch(criteria: ISearchCriteria): Promise<IServiceResponse<IHotelSemanticResult>>;
  generateHotelByIA(): Promise<IHotel>;
  getTags(): Promise<string[]>;
}
