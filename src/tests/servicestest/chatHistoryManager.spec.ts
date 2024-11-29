import { IMessage } from "../../interfaces/IAskAssistantResponse";
import ChatHistoryManager from "../../services/chatHistoryManager";
import SessionManagerService from "../../services/sessionManagerService";

// chatHistoryManager.test.ts 
jest.mock('../../services/sessionManagerService', () => ({
    saveToSession: jest.fn(),
    getFromSession: jest.fn(),
    removeFromSession: jest.fn(),
}));

describe('chatHistoryManager', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should save a message to session storage', () => {
        const message: IMessage = { sender: 'user', text: 'Hello' };
        const history: IMessage[] = [];

        (SessionManagerService.getFromSession as jest.Mock).mockReturnValue(history);
        ChatHistoryManager.saveMessage(message);

        expect(SessionManagerService.getFromSession).toHaveBeenCalledWith('chatHistory');
        expect(SessionManagerService.saveToSession).toHaveBeenCalledWith('chatHistory', [message]);
    });

    test('should retrieve chat history from session storage', () => {
        const history: IMessage[] = [
            { sender: 'user', text: 'Hello' },
            { sender: 'bot', text: 'Hi there!' },
        ];

        (SessionManagerService.getFromSession as jest.Mock).mockReturnValue(history);
        const retrievedHistory = ChatHistoryManager.getChatHistory();

        expect(SessionManagerService.getFromSession).toHaveBeenCalledWith('chatHistory');
        expect(retrievedHistory).toEqual(history);
    });

    test('should return an empty array if chat history does not exist in session storage', () => {
        (SessionManagerService.getFromSession as jest.Mock).mockReturnValue(null);
        const retrievedHistory = ChatHistoryManager.getChatHistory();

        expect(SessionManagerService.getFromSession).toHaveBeenCalledWith('chatHistory');
        expect(retrievedHistory).toEqual([]);
    });

    test('should clear chat history from session storage', () => {
        ChatHistoryManager.clearChatHistory();

        expect(SessionManagerService.removeFromSession).toHaveBeenCalledWith('chatHistory');
    });
});
