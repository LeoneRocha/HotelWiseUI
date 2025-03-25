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
  getChatHistoryToken(): string {
    let lastToken: string = ''
    const chatHistory = this.getChatHistory();
    // Encontra o primeiro token válido
    if (chatHistory != undefined && chatHistory != null && chatHistory.length > 0) {
      const validTokenMessage = chatHistory.find(
        (msg) => msg.token && msg.token !== '' && msg.token !== null && msg.token !== undefined
      );
      lastToken = validTokenMessage ? validTokenMessage.token : ''; // Retorna o token ou string vazia
    }  
    return lastToken; // Retorna o token encontrado
  }
}

export default new ChatHistoryManager();
