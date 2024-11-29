// services/chatHistoryManager.ts
import { IMessage } from '../interfaces/IAskAssistantResponse';
import { IChatHistoryManager } from '../interfaces/services/IChatHistoryManager';
import SessionManagerService from './sessionManagerService';

const SESSION_KEY = 'chatHistory';
class ChatHistoryManager implements IChatHistoryManager {
  saveMessage(message: IMessage): void {
    const history = this.getChatHistory();
    history.push(message);
    SessionManagerService.saveToSession(SESSION_KEY, history);
  }

  getChatHistory(): IMessage[] {
    return SessionManagerService.getFromSession<IMessage[]>(SESSION_KEY) || [];
  }

  clearChatHistory(): void {
    SessionManagerService.removeFromSession(SESSION_KEY);
  }
}

export default new ChatHistoryManager();
