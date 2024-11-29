import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as chatHistoryManager from '../services/chatHistoryManager';
import { getChatCompletion } from '../services/assistantService';
import Chatbot from '../components/Chatbot';
import LocalStorageService from '../services/localStorageService';

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

describe('Chatbot component', () => {
    const nameChat : string ='Fale com o assistente';

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

        fireEvent.click(screen.getByText(nameChat)); // Abrir o modal

        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });

    test('sends a message and saves to history', async () => {
        (getChatCompletion as jest.Mock).mockResolvedValue([{ response: 'I am fine, thank you!' }]);
        (LocalStorageService.getItem as jest.Mock).mockReturnValue('dummy-token');

        render(<Chatbot />);

        fireEvent.click(screen.getByText(nameChat)); // Abrir o modal

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
        (LocalStorageService.getItem as jest.Mock).mockReturnValue('dummy-token');

        render(<Chatbot />);

        fireEvent.click(screen.getByText(nameChat)); // Abrir o modal

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

    test('displays authentication alert if user is not authenticated', async () => {
        (LocalStorageService.getItem as jest.Mock).mockReturnValue(null);

        render(<Chatbot />);

        fireEvent.click(screen.getByText(nameChat)); // Abrir o modal

        fireEvent.change(screen.getByPlaceholderText('Digite sua mensagem...'), {
            target: { value: 'How are you?' },
        });
        fireEvent.submit(screen.getByRole('button', { name: /enviar/i }));

        await waitFor(() => {
            expect(screen.getByText('Para utilizar o assistente, você precisa fazer login.')).toBeInTheDocument();
            expect(chatHistoryManager.saveMessage).toHaveBeenCalledTimes(0); // Verifica se nenhuma mensagem foi salva
            expect(chatHistoryManager.saveMessage).not.toHaveBeenCalledWith(expect.objectContaining({
                sender: 'user',
                text: 'How are you?',
            }));
        });
    });

    test('clears chat history', async () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByText(nameChat)); // Abrir o modal

        fireEvent.click(screen.getByText('Limpar Histórico'));

        await waitFor(() => {
            expect(chatHistoryManager.clearChatHistory).toHaveBeenCalled();
            expect(screen.queryByText('Hello')).not.toBeInTheDocument();
        });
    });

    test('does not add welcome messages if chat history exists', async () => {
        const messages = [
            { sender: 'user', text: 'Hello' },
        ];
        (chatHistoryManager.getChatHistory as jest.Mock).mockReturnValue(messages);

        render(<Chatbot />);

        fireEvent.click(screen.getByText(nameChat)); // Abrir o modal

        await waitFor(() => {
            expect(screen.getByText('Hello')).toBeInTheDocument();
            expect(screen.queryByText('Olá! Eu sou seu assistente virtual. Como posso ajudar você hoje?')).not.toBeInTheDocument();
        });
    });
});
