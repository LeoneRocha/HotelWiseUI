import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatMessage from '../components/ChatMessage';
import { Message } from '../interfaces/AskAssistantResponse';


// Mock the chat history manager and assistant service
jest.mock('../services/chatHistoryManager', () => ({
    saveMessage: jest.fn(),
    getChatHistory: jest.fn(() => []),
    clearChatHistory: jest.fn(),
}));

jest.mock('../services/assistantService', () => ({
    getChatCompletion: jest.fn(),
}));

jest.mock('../services/LocalStorageService', () => ({
    getItem: jest.fn(),
}));

describe('ChatMessage component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock do console.warn para suprimir os avisos durante os testes
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });
    test('renders user message correctly', () => {
        const message: Message = { sender: 'user', text: 'Hello!' };
        const { getByText } = render(<ChatMessage message={message} />);

        expect(getByText('Hello!')).toBeInTheDocument();
    });

    test('renders bot message correctly with HTML', () => {
        const message: Message = { sender: 'bot', text: '<strong>Hello!</strong>' };
        const { getByText } = render(<ChatMessage message={message} />);

        expect(getByText('Hello!')).toBeInTheDocument();
    });
});
