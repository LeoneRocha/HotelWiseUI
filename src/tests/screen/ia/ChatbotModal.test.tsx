vi.mock('react-draggable', async () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatbotModal from '../../../components/iaassistent/ChatbotModal';
import { IMessage } from '../../../interfaces/model/IA/IAskAssistantResponse';

describe('ChatbotModal component', () => {
    const mockProps = {
        messages: [
            { sender: 'user', text: 'Hello' },
            { sender: 'bot', text: 'Hi there!' }
        ] as IMessage[],
        isTyping: false,
        showAlert: false,
        input: '',
        handleSubmit: vi.fn(),
        handleClearHistory: vi.fn(),
        setInput: vi.fn(),
        toggleModal: vi.fn()
    };

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock do console.warn para suprimir os avisos durante os testes
        vi.spyOn(console, 'warn').mockImplementation(() => { });
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });
    test('renders messages correctly', () => {
        const { getByText } = render(<ChatbotModal {...mockProps} />);

        expect(getByText('Hello')).toBeInTheDocument();
        expect(getByText('Hi there!')).toBeInTheDocument();
    });

    test('handles form submission', () => {
        const { getByPlaceholderText, getByRole } = render(<ChatbotModal {...mockProps} />);
        fireEvent.change(getByPlaceholderText('Digite sua mensagem...'), { target: { value: 'How are you?' } });
        fireEvent.submit(getByRole('button', { name: /enviar/i }));

        expect(mockProps.handleSubmit).toHaveBeenCalled();
    });

    test('handles clear history', () => {
        const { getByText } = render(<ChatbotModal {...mockProps} />);
        fireEvent.click(getByText('Limpar Histórico'));

        expect(mockProps.handleClearHistory).toHaveBeenCalled();
    });
});
