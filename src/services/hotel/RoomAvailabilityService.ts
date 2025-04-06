import { IServiceResponse } from "../../interfaces/GeneralInterfaces";
import { IRoomAvailability, RoomAvailabilitySearchDto } from "../../interfaces/model/Hotel/IRoomAvailability";
import { GenericService } from "../Generic/GenericService";
import EnvironmentService from "../general/EnvironmentService";

// Configuração do Endpoint para RoomAvailability
const BASE_URL = EnvironmentService.getApiBaseUrl();

class RoomAvailabilityService extends GenericService<IRoomAvailability> {
  constructor() {
    super(BASE_URL, "/RoomAvailability");
  }

  // Cria uma nova disponibilidade
  async createAvailability(availability: IRoomAvailability): Promise<IServiceResponse<IRoomAvailability>> {
    const response = await this.api.post<IServiceResponse<IRoomAvailability>>(this.endpoint, availability);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || "Erro ao criar a disponibilidade do quarto.");
  }

  // Cria disponibilidades em lote
  async createBatch(availabilities: IRoomAvailability[]): Promise<IServiceResponse<string>> {
    const response = await this.api.post<IServiceResponse<string>>(`${this.endpoint}/batch`, availabilities);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || "Erro ao criar disponibilidades em lote.");
  }

  // Atualiza uma disponibilidade
  async updateAvailability(id: number, availability: IRoomAvailability): Promise<IServiceResponse<IRoomAvailability>> {
    const response = await this.api.put<IServiceResponse<IRoomAvailability>>(`${this.endpoint}/${id}`, availability);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || "Erro ao atualizar a disponibilidade do quarto.");
  }

  // Exclui uma disponibilidade
  async deleteAvailability(id: number): Promise<IServiceResponse<string>> {
    const response = await this.api.delete<IServiceResponse<string>>(`${this.endpoint}/${id}`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || "Erro ao excluir a disponibilidade do quarto.");
  }

  // Recupera disponibilidades por RoomId
  async getAvailabilitiesByRoomId(roomId: number): Promise<IServiceResponse<IRoomAvailability[]>> {
    const response = await this.api.get<IServiceResponse<IRoomAvailability[]>>(`${this.endpoint}/room/${roomId}`);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || "Erro ao buscar disponibilidades pelo RoomId.");
  }

  // Busca disponibilidades com base nos critérios
  async getAvailabilitiesBySearchCriteria(criteria: RoomAvailabilitySearchDto): Promise<IServiceResponse<IRoomAvailability[]>> {
    const response = await this.api.post<IServiceResponse<IRoomAvailability[]>>(`${this.endpoint}/availabilities`, criteria);
    if (response.data.success) {
      return response.data;
    }
    throw new Error(response.data.message || "Erro ao buscar disponibilidades com base nos critérios.");
  }
}

export default new RoomAvailabilityService();
