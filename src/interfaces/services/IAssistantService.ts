// interfaces/IAssistantService.ts

import { IAskAssistantRequest } from "../model/IA/IAskAssistantRequest";
import { IAskAssistantResponse } from "../model/IA/IAskAssistantResponse";

export interface IAssistantService {
  getChatCompletion(criteria: IAskAssistantRequest): Promise<IAskAssistantResponse[]>;
}
