import { DotNetDayOfWeek } from "../../../enums/DotNetDayOfWeek";
import { RoomAvailabilityStatus } from "../../../enums/hotel/RoomStatus";

export interface IRoomAvailability {
  id: number;
  roomId: number;
  currency: string;
  startDate: Date; // Data inicial do período
  endDate: Date;   // Data final do período
  availabilityWithPrice: RoomPriceAndAvailabilityItem[];
  roomDetails?: object; // Detalhes adicionais do quarto
}

export interface RoomPriceAndAvailabilityItem {
  dayOfWeek: DotNetDayOfWeek;        // Dia da semana
  price: number;            // Preço
  quantityAvailable: number;// Quantidade disponível
  currency: string;         // Moeda (ex.: USD, BRL)
  status: RoomAvailabilityStatus;           // Status (ex.: Disponível, Reservado, Bloqueado)
}

export interface RoomAvailabilitySearchDto {
  hotelId: number;       // ID do hotel
  startDate: Date;     // Data inicial obrigatória
  currency: string;
  endDate?: Date;      // Data final opcional
}
