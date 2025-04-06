import { IServiceResponse } from "../../GeneralInterfaces";
import { IReservation } from "../../model/Hotel/IReservation";
 
export interface IReservationService {
  getById(id: number): Promise<IServiceResponse<IReservation>>;
  getReservationById(reservationId: number): Promise<IServiceResponse<IReservation>>;
  getReservationsByRoomId(roomId: number): Promise<IServiceResponse<IReservation[]>>;
  cancelReservation(reservationId: number): Promise<IServiceResponse<string>>;
  create(item: IReservation): Promise<IServiceResponse<IReservation>>;
  update(id: number, item: IReservation): Promise<IServiceResponse<IReservation>>;
  delete(id: number): Promise<IServiceResponse<string>>;
}
