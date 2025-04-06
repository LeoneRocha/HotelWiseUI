// interfaces/IChatHistoryManager.ts

import { IMessage } from "../model/IA/IAskAssistantResponse";


export interface IChatHistoryManager {
  saveMessage(message: IMessage): void;
  getChatHistory(): IMessage[];
  clearChatHistory(): void;
  getChatHistoryToken(): string;
}
