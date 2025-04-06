export enum RoomStatus {
    Available = 1,   // Disponível
    Occupied = 2,    // Ocupado
    Maintenance = 3, // Em Manutenção
    Cleaning = 4,    // Em Limpeza
    Unavailable = 5  // Indisponível
  }

  export const RoomStatusDescriptions: Record<number, string> = {
    [RoomStatus.Available]: "Disponível",
    [RoomStatus.Occupied]: "Ocupado",
    [RoomStatus.Maintenance]: "Em Manutenção",
    [RoomStatus.Cleaning]: "Em Limpeza",
    [RoomStatus.Unavailable]: "Indisponível",
  };
  
  
export enum ReservationStatus {
    Confirmed = 1, // Reserva confirmada
    Cancelled = 2, // Reserva cancelada
    Pending = 3    // Reserva pendente
  }

  export const ReservationStatusDescriptions: Record<number, string> = {
    [ReservationStatus.Confirmed]: "Confirmada",
    [ReservationStatus.Cancelled]: "Cancelada",
    [ReservationStatus.Pending]: "Pendente",
  };
  
  