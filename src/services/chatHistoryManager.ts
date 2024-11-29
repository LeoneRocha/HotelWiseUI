// services/chatHistoryManager.ts
import { IMessage } from '../interfaces/IAskAssistantResponse';
import { IChatHistoryManager } from '../interfaces/services/IChatHistoryManager';
import { saveToSession, getFromSession, removeFromSession } from './sessionManagerService';

const SESSION_KEY = 'chatHistory';
class ChatHistoryManager implements IChatHistoryManager {
  saveMessage(message: IMessage): void {
    const history = this.getChatHistory();
    history.push(message);
    saveToSession(SESSION_KEY, history);
  }

  getChatHistory(): IMessage[] {
    return getFromSession<IMessage[]>(SESSION_KEY) || [];
  }

  clearChatHistory(): void {
    removeFromSession(SESSION_KEY);
  }
}

export default new ChatHistoryManager();
