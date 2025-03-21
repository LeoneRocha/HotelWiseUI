// interfaces/IAssistantService.ts

import { IAskAssistantRequest } from "../IAskAssistantRequest";
import { IAskAssistantResponse } from "../IAskAssistantResponse";

export interface IAssistantService {
  getChatCompletion(criteria: IAskAssistantRequest): Promise<IAskAssistantResponse[]>;
}
