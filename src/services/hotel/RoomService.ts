import { IServiceResponse } from "../../interfaces/GeneralInterfaces";
import { IRoom } from "../../interfaces/model/Hotel/IRoom";
import { IRoomService } from "../../interfaces/services/hotel/IRoomService";
import { GenericService } from "../Generic/GenericService";
import EnvironmentService from '../general/EnvironmentService';

// Configuração do Endpoint para Room
const BASE_URL = EnvironmentService.getApiBaseUrl();

class RoomService extends GenericService<IRoom> implements IRoomService {
  constructor() {
    super(BASE_URL, '/Rooms/v1');
  }

  async getRoomsByHotelId(hotelId: number): Promise<IServiceResponse<IRoom[]>> {
    const response = await this.api.get<IServiceResponse<IRoom[]>>(`${this.endpoint}/hotel/${hotelId}`);
    return response.data;
  }
}

export default new RoomService();