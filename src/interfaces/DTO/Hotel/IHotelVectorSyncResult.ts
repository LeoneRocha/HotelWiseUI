export interface IHotelVectorSyncResult {
  totalHotels: number;
  synchronizedCount: number;
  failedCount: number;
  allProcessed: boolean;
  errors: string[];
}
