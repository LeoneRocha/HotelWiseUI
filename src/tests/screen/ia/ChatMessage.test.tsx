import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatMessage from '../../../components/ChatMessage';
import { IMessage } from '../../../interfaces/model/IA/IAskAssistantResponse';


// Mock the chat history manager and assistant service
jest.mock('../../../services/iainteference/chatHistoryManager', () => ({
    saveMessage: jest.fn(),
    getChatHistory: jest.fn(() => []),
    clearChatHistory: jest.fn(),
}));

jest.mock('../../../services/iainteference/assistantService', () => ({
    getChatCompletion: jest.fn(),
}));

jest.mock('../../../services/general/LocalStorageService', () => ({
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
        const message: IMessage = { sender: 'user', text: 'Hello!', id: '1', token: '' };   
        const { getByText } = render(<ChatMessage message={message} />);

        expect(getByText('Hello!')).toBeInTheDocument();
    });

    test('renders bot message correctly with HTML', () => {
        const message: IMessage = { sender: 'bot', text: '<strong>Hello!</strong>', id: '1', token: '' };   
        const { getByText } = render(<ChatMessage message={message} />);

        expect(getByText('Hello!')).toBeInTheDocument();
    });
});
