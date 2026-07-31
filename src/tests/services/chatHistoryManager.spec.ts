import { type Mock } from 'vitest';
import { IMessage } from "../../interfaces/model/IA/IAskAssistantResponse";
import ChatHistoryManager from "../../services/iainteference/chatHistoryManager";
import SessionManagerService from "../../services/general/sessionManagerService";

// chatHistoryManager.test.ts 
vi.mock('../../services/general/sessionManagerService', async () => ({
  default: {
    saveToSession: vi.fn(),
    getFromSession: vi.fn(),
    removeFromSession: vi.fn(),
  },
}));

describe('chatHistoryManager', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should save a message to session storage', () => {
        const message: IMessage = { sender: 'user', text: 'Hello', id: '1', token: '' };
        const history: IMessage[] = [];

        (SessionManagerService.getFromSession as Mock).mockReturnValue(history);
        ChatHistoryManager.saveMessage(message);

        expect(SessionManagerService.getFromSession).toHaveBeenCalledWith('chatHistory');
        expect(SessionManagerService.saveToSession).toHaveBeenCalledWith('chatHistory', [message]);
    });

    test('should retrieve chat history from session storage', () => {
        const history: IMessage[] = [
            { sender: 'user', text: 'Hello', id: '1' , token: '' },
            { sender: 'bot', text: 'Hi there!', id : '2', token: '' },  
        ];

        (SessionManagerService.getFromSession as Mock).mockReturnValue(history);
        const retrievedHistory = ChatHistoryManager.getChatHistory();

        expect(SessionManagerService.getFromSession).toHaveBeenCalledWith('chatHistory');
        expect(retrievedHistory).toEqual(history);
    });

    test('should return an empty array if chat history does not exist in session storage', () => {
        (SessionManagerService.getFromSession as Mock).mockReturnValue(null);
        const retrievedHistory = ChatHistoryManager.getChatHistory();

        expect(SessionManagerService.getFromSession).toHaveBeenCalledWith('chatHistory');
        expect(retrievedHistory).toEqual([]);
    });

    test('should clear chat history from session storage', () => {
        ChatHistoryManager.clearChatHistory();

        expect(SessionManagerService.removeFromSession).toHaveBeenCalledWith('chatHistory');
    });
});
