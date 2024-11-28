// Chatbot.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as chatHistoryManager from '../services/chatHistoryManager';
import { getChatCompletion } from '../services/assistantService';
import Chatbot from '../components/Chatbot';

// Mock the chat history manager and assistant service
jest.mock('../services/chatHistoryManager', () => ({
    saveMessage: jest.fn(),
    getChatHistory: jest.fn(() => []),
    clearChatHistory: jest.fn(),
}));

jest.mock('../services/assistantService', () => ({
    getChatCompletion: jest.fn(),
}));

describe('Chatbot component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock do console.warn para suprimir os avisos durante os testes
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });
    test('renders chat messages from history', () => {
        const messages = [
            { sender: 'user', text: 'Hello' },
            { sender: 'bot', text: 'Hi there!' },
        ];
        (chatHistoryManager.getChatHistory as jest.Mock).mockReturnValue(messages);

        render(<Chatbot />);

        fireEvent.click(screen.getByText('Chat')); // Abrir o modal

        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });

    test('sends a message and saves to history', async () => {
        (getChatCompletion as jest.Mock).mockResolvedValue([{ response: 'I am fine, thank you!' }]);

        render(<Chatbot />);

        fireEvent.click(screen.getByText('Chat')); // Abrir o modal

        fireEvent.change(screen.getByPlaceholderText('Digite sua mensagem...'), {
            target: { value: 'How are you?' },
        });
        fireEvent.submit(screen.getByRole('button', { name: /enviar/i }));

        await waitFor(() => {
            expect(screen.getByText('How are you?')).toBeInTheDocument();
            expect(screen.getByText('I am fine, thank you!')).toBeInTheDocument();
            expect(chatHistoryManager.saveMessage).toHaveBeenCalledWith({
                sender: 'user',
                text: 'How are you?',
            });
            expect(chatHistoryManager.saveMessage).toHaveBeenCalledWith({
                sender: 'bot',
                text: 'I am fine, thank you!',
            });
        });
    });

    test('handles API error and displays error message', async () => {
        (getChatCompletion as jest.Mock).mockRejectedValue(new Error('Erro na API'));

        render(<Chatbot />);

        fireEvent.click(screen.getByText('Chat')); // Abrir o modal

        fireEvent.change(screen.getByPlaceholderText('Digite sua mensagem...'), {
            target: { value: 'How are you?' },
        });
        fireEvent.submit(screen.getByRole('button', { name: /enviar/i }));

        await waitFor(() => {
            expect(screen.getByText('Ocorreu um erro ao consultar a API. Por favor, tente novamente.')).toBeInTheDocument();
            expect(chatHistoryManager.saveMessage).toHaveBeenCalledWith({
                sender: 'bot',
                text: 'Ocorreu um erro ao consultar a API. Por favor, tente novamente.',
            });
        });
    });

    test('clears chat history', async () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByText('Chat')); // Abrir o modal

        fireEvent.click(screen.getByText('Limpar Histórico'));

        await waitFor(() => {
            expect(chatHistoryManager.clearChatHistory).toHaveBeenCalled();
            expect(screen.queryByText('Hello')).not.toBeInTheDocument();
        });
    });
});
