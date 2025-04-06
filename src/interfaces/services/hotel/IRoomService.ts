import { IServiceResponse } from "../../GeneralInterfaces";
import { IRoom } from "../../model/IRoom"; 

export interface IRoomService {
  getById(id: number): Promise<IServiceResponse<IRoom>>;          // Busca quarto pelo ID
  getRoomsByHotelId(hotelId: number): Promise<IServiceResponse<IRoom[]>>; // Busca quartos por ID do hotel
  create(room: IRoom): Promise<IServiceResponse<IRoom>>;          // Cria um novo quarto
  update(id: number, room: IRoom): Promise<IServiceResponse<IRoom>>; // Atualiza um quarto pelo ID
  delete(id: number): Promise<IServiceResponse<string>>;          // Exclui um quarto pelo ID
}
