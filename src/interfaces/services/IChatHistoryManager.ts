// interfaces/IChatHistoryManager.ts

import { IMessage } from "../IAskAssistantResponse";


export interface IChatHistoryManager {
  saveMessage(message: IMessage): void;
  getChatHistory(): IMessage[];
  clearChatHistory(): void;
  getChatHistoryToken(): string;
}
