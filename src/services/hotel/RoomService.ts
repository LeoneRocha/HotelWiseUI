import { IServiceResponse } from "../../interfaces/GeneralInterfaces";
import { IRoom } from "../../interfaces/model/IRoom";
import { GenericService } from "../Generic/GenericService";
 
// Endpoints do serviço Room
const ROOM_ENDPOINT = '/Rooms';
const ROOM_BY_HOTEL_ENDPOINT = (hotelId: number) => `/Rooms/byHotel/${hotelId}`;

class RoomService extends GenericService<IRoom> {
  constructor(baseURL: string) {
    super(baseURL, ROOM_ENDPOINT);
  }

  // Busca quartos por ID do hotel
  async getRoomsByHotelId(hotelId: number): Promise<IServiceResponse<IRoom[]>> {
    const response = await this.api.get<IServiceResponse<IRoom[]>>(ROOM_BY_HOTEL_ENDPOINT(hotelId));
    return response.data;
  }
}

export default new RoomService(process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api');
