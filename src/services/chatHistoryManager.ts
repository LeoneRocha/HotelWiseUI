// chatHistoryManager.ts
import { IMessage } from '../interfaces/IAskAssistantResponse';
import { saveToSession, getFromSession, removeFromSession } from './sessionManagerService'
const SESSION_KEY = 'chatHistory';


export const saveMessage = (message: IMessage) => {
    const history = getChatHistory();
    history.push(message);
    saveToSession(SESSION_KEY, history);
};

export const getChatHistory = (): IMessage[] => {
    return getFromSession<IMessage[]>(SESSION_KEY) || [];
};

export const clearChatHistory = () => {
    removeFromSession(SESSION_KEY);
};
