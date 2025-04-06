import { IServiceResponse } from "../../interfaces/GeneralInterfaces";
import { IReservation } from "../../interfaces/model/Hotel/IReservation";
import { IReservationService } from "../../interfaces/services/hotel/IReservationService";
import { GenericService } from "../Generic/GenericService";
import EnvironmentService from '../general/EnvironmentService';

// Configuração do Endpoint para Reservation
const BASE_URL = EnvironmentService.getApiBaseUrl();

class ReservationService extends GenericService<IReservation> implements IReservationService {
  constructor() {
    super(BASE_URL, '/Reservations');
  }

  async cancelReservation(reservationId: number): Promise<IServiceResponse<string>> {
    const response = await this.api.patch<IServiceResponse<string>>(`${this.endpoint}/cancel/${reservationId}`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Erro ao cancelar a reserva');
  }

  async getReservationById(reservationId: number): Promise<IServiceResponse<IReservation>> {
    const response = await this.api.get<IServiceResponse<IReservation>>(`${this.endpoint}/${reservationId}`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Erro ao buscar a reserva pelo ID');
  }

  async getReservationsByRoomId(roomId: number): Promise<IServiceResponse<IReservation[]>> {
    const response = await this.api.get<IServiceResponse<IReservation[]>>(`${this.endpoint}/byRoom/${roomId}`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || 'Erro ao buscar reservas pelo ID do quarto');
  }
}

export default new ReservationService();
