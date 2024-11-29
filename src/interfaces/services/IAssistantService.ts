// interfaces/IAssistantService.ts

import { IAskAssistantResponse } from "../IAskAssistantResponse";

export interface IAssistantService {
  getChatCompletion(criteria: { maxHotelRetrieve: number; searchTextCriteria: string }): Promise<IAskAssistantResponse[]>;
}
