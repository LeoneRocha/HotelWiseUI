import { ReservationStatus } from "../../../enums/hotel/RoomStatus";

export interface IReservation {
    id: number;
    roomId: number;
    userId?: number;
    checkInDate: string;
    checkOutDate: string;
    reservationDate: string;
    totalAmount: number;
    currency: string;
    status: ReservationStatus;
    roomDetails?: object; // Detalhes do quarto associados à reserva
  }
  