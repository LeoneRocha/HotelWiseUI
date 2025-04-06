import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatHistoryManager from '../services/iainteference/chatHistoryManager';
import AssistantService from '../services/iainteference/assistantService';
import Chatbot from '../components/Chatbot';
import LocalStorageService from '../services/general/localStorageService';
import { IMessage } from '../interfaces/IAskAssistantResponse';

// Mock the chat history manager and assistant service
jest.mock('../services/iainteference/chatHistoryManager', () => ({
    saveMessage: jest.fn(),
    getChatHistory: jest.fn(() => []),
    clearChatHistory: jest.fn(),
}));

jest.mock('../services/iainteference/assistantService', () => ({
    getChatCompletion: jest.fn(),
}));

jest.mock('../services/general/localStorageService', () => ({
    getItem: jest.fn(),
}));

describe('Chatbot component', () => {
    const nameChat = 'Fale com o assistente';

    beforeEach(() => {
        jest.clearAllMocks();
        // Mock do console.warn para suprimir os avisos durante os testes
        jest.spyOn(console, 'warn').mockImplementation(() => { });
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    test('renders chat messages from history', () => {
        const messages: IMessage[] = [
            { sender: 'user', text: 'Hello', id: '1', token: '' },
            { sender: 'bot', text: 'Hi there!', id: '2', token: '' },
        ];
        (ChatHistoryManager.getChatHistory as jest.Mock).mockReturnValue(messages);

        render(<Chatbot />);

        fireEvent.click(screen.getByText(nameChat)); // Abrir o modal

        expect(screen.getByText('Hello')).toBeInTheDocument();
        expect(screen.getByText('Hi there!')).toBeInTheDocument();
    });
 
    test('handles API error and displays error message', async () => {
        (AssistantService.getChatCompletion as jest.Mock).mockRejectedValue(new Error('Erro na API'));
        (LocalStorageService.getItem as jest.Mock).mockReturnValue('dummy-token');

        render(<Chatbot />);

        fireEvent.click(screen.getByText(nameChat)); // Abrir o modal

        fireEvent.change(screen.getByPlaceholderText('Digite sua mensagem...'), {
            target: { value: 'How are you?', id: '3' },
        });
        fireEvent.submit(screen.getByRole('button', { name: /enviar/i }));

        await waitFor(() => {
            expect(screen.getByText('Ocorreu um erro ao consultar a API. Por favor, tente novamente.')).toBeInTheDocument();
            expect(ChatHistoryManager.saveMessage).toHaveBeenCalledWith({
                sender: 'bot',
                text: 'Ocorreu um erro ao consultar a API. Por favor, tente novamente.', id: '4', token: ''
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
            expect(ChatHistoryManager.saveMessage).toHaveBeenCalledTimes(0); // Verifica se nenhuma mensagem foi salva
            expect(ChatHistoryManager.saveMessage).not.toHaveBeenCalledWith(expect.objectContaining({
                sender: 'user',
                text: 'How are you?', token: ''
            }));
        });
    });

    test('clears chat history', async () => {
        render(<Chatbot />);

        fireEvent.click(screen.getByText(nameChat)); // Abrir o modal

        fireEvent.click(screen.getByText('Limpar Histórico'));

        await waitFor(() => {
            expect(ChatHistoryManager.clearChatHistory).toHaveBeenCalled();
            expect(screen.queryByText('Hello')).not.toBeInTheDocument();
        });
    });

    test('does not add welcome messages if chat history exists', async () => {
        const messages: IMessage[] = [
            { sender: 'user', text: 'Hello', id: '1', token: '' },
        ];
        (ChatHistoryManager.getChatHistory as jest.Mock).mockReturnValue(messages);

        render(<Chatbot />);

        fireEvent.click(screen.getByText(nameChat)); // Abrir o modal

        await waitFor(() => {
            expect(screen.getByText('Hello')).toBeInTheDocument();
            expect(screen.queryByText('Olá! Eu sou seu assistente virtual. Como posso ajudar você hoje?')).not.toBeInTheDocument();
        });
    });
});
