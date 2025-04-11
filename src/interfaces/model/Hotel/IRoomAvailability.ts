import { DotNetDayOfWeek } from "../../../enums/DotNetDayOfWeek";
import { RoomAvailabilityStatus } from "../../../enums/hotel/RoomStatus";

export interface IRoomAvailability {
  id: number;
  roomId: number;
  startDate: string; // Data inicial do período
  endDate: string;   // Data final do período
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
  startDate: string;     // Data inicial obrigatória
  endDate?: string;      // Data final opcional
}
