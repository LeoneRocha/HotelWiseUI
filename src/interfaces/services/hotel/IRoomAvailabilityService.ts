import { IServiceResponse } from "../../GeneralInterfaces";
import { IRoomAvailability, RoomAvailabilitySearchDto } from "../../model/Hotel/IRoomAvailability";

export interface IRoomAvailabilityService {
  createAvailability(availability: IRoomAvailability): Promise<IServiceResponse<IRoomAvailability>>;
  createBatch(availabilities: IRoomAvailability[]): Promise<IServiceResponse<string>>;
  updateAvailability(id: number, availability: IRoomAvailability): Promise<IServiceResponse<IRoomAvailability>>;
  deleteAvailability(id: number): Promise<IServiceResponse<string>>;
  getAvailabilitiesByRoomId(roomId: number): Promise<IServiceResponse<IRoomAvailability[]>>;
  getAvailabilitiesBySearchCriteria(criteria: RoomAvailabilitySearchDto): Promise<IServiceResponse<IRoomAvailability[]>>;
}
