import { Message } from "../../interfaces/AskAssistantResponse";
import { clearChatHistory, getChatHistory,  saveMessage } from "../../services/chatHistoryManager";
import { getFromSession, removeFromSession, saveToSession } from "../../services/sessionManagerService";

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
        const message: Message = { sender: 'user', text: 'Hello' };
        const history: Message[] = [];

        (getFromSession as jest.Mock).mockReturnValue(history);
        saveMessage(message);

        expect(getFromSession).toHaveBeenCalledWith('chatHistory');
        expect(saveToSession).toHaveBeenCalledWith('chatHistory', [message]);
    });

    test('should retrieve chat history from session storage', () => {
        const history: Message[] = [
            { sender: 'user', text: 'Hello' },
            { sender: 'bot', text: 'Hi there!' },
        ];

        (getFromSession as jest.Mock).mockReturnValue(history);
        const retrievedHistory = getChatHistory();

        expect(getFromSession).toHaveBeenCalledWith('chatHistory');
        expect(retrievedHistory).toEqual(history);
    });

    test('should return an empty array if chat history does not exist in session storage', () => {
        (getFromSession as jest.Mock).mockReturnValue(null);
        const retrievedHistory = getChatHistory();

        expect(getFromSession).toHaveBeenCalledWith('chatHistory');
        expect(retrievedHistory).toEqual([]);
    });

    test('should clear chat history from session storage', () => {
        clearChatHistory();

        expect(removeFromSession).toHaveBeenCalledWith('chatHistory');
    });
});
