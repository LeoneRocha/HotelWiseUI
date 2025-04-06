import { IHotel } from './IHotel';

export interface IHotelSemanticResult {
    promptResultContent: string;
    hotelsVectorResult: IHotel[];
    hotelsIAResult: IHotel[];
}
