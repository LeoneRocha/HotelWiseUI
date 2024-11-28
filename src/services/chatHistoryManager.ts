// chatHistoryManager.ts
import { saveToSession, getFromSession, removeFromSession } from './sessionManagerService'
const SESSION_KEY = 'chatHistory';

export interface Message {
    sender: 'user' | 'bot';
    text: string;
}

export const saveMessage = (message: Message) => {
    const history = getChatHistory();
    history.push(message);
    saveToSession(SESSION_KEY, history);
};

export const getChatHistory = (): Message[] => {
    return getFromSession<Message[]>(SESSION_KEY) || [];
};

export const clearChatHistory = () => {
    removeFromSession(SESSION_KEY);
};
