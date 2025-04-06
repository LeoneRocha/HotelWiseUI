export interface IRoomAvailability {
  id: number;
  roomId: number;
  startDate: string; // Data inicial do período
  endDate: string;   // Data final do período
  availabilityWithPrice: RoomPriceAndAvailabilityItem[];
  roomDetails?: object; // Detalhes adicionais do quarto
}

export interface RoomPriceAndAvailabilityItem {
  date: string;             // Data específica
  dayOfWeek: string;        // Dia da semana
  price: number;            // Preço
  quantityAvailable: number;// Quantidade disponível
  currency: string;         // Moeda (ex.: USD, BRL)
  status: string;           // Status (ex.: Disponível, Reservado, Bloqueado)
}

export interface RoomAvailabilitySearchDto {
  hotelId: number;       // ID do hotel
  startDate: string;     // Data inicial obrigatória
  endDate?: string;      // Data final opcional
}
