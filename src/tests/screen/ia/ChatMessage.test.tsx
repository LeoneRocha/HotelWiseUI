import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatMessage from '../../../components/iaassistent/ChatMessage';
import { IMessage } from '../../../interfaces/model/IA/IAskAssistantResponse';


// Mock the chat history manager and assistant service
vi.mock('../../../services/iainteference/chatHistoryManager', async () => ({
  default: {
    saveMessage: vi.fn(),
    getChatHistory: vi.fn(() => []),
    clearChatHistory: vi.fn(),
  },
}));

vi.mock('../../../services/iainteference/assistantService', async () => ({
  default: {
    getChatCompletion: vi.fn(),
  },
}));

vi.mock('../../../services/general/LocalStorageService', async () => ({
  default: {
    getItem: vi.fn(),
  },
}));

describe('ChatMessage component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        // Mock do console.warn para suprimir os avisos durante os testes
        vi.spyOn(console, 'warn').mockImplementation(() => { });
        vi.spyOn(console, 'error').mockImplementation(() => { });
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
