import { type Mock } from 'vitest';
// Mock do Draggable para evitar problemas de ambiente de teste
vi.mock('react-draggable', async () => ({
    __esModule: true,
    default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ChatHistoryManager from '../../../services/iainteference/chatHistoryManager';
import AssistantService from '../../../services/iainteference/assistantService';
import Chatbot from '../../../components/iaassistent/Chatbot';
import LocalStorageService from '../../../services/general/localStorageService';
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

vi.mock('../../../services/general/localStorageService', async () => ({
  default: {
    getItem: vi.fn(),
  },
}));

describe('Chatbot component', () => {
    beforeAll(() => {
        // Força modo desktop para garantir que o botão seja renderizado corretamente
        Object.defineProperty(window, 'innerWidth', { writable: true, configurable: true, value: 1024 });
        window.dispatchEvent(new Event('resize'));
    });
    // const nameChat = /fale com o assistente/i;

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock do console.warn para suprimir os avisos durante os testes
        vi.spyOn(console, 'warn').mockImplementation(() => { });
        vi.spyOn(console, 'error').mockImplementation(() => { });
    });

    test('renders chat messages from history', async () => {
        const messages: IMessage[] = [
            { sender: 'user', text: 'Hello', id: '1', token: '' },
            { sender: 'bot', text: 'Hi there!', id: '2', token: '' },
        ];
        (ChatHistoryManager.getChatHistory as Mock).mockReturnValue(messages);

        render(<Chatbot />);

    // Log dos botões encontrados
    const buttons = await waitFor(() => screen.getAllByRole('button'));
    console.log('Botões encontrados:', buttons.map(b => b.textContent));
    const openButton = buttons[0];
    await userEvent.click(openButton);

        // Aguarda o modal abrir
        await waitFor(() => {
            expect(screen.getByText('Hello')).toBeInTheDocument();
            expect(screen.getByText('Hi there!')).toBeInTheDocument();
        });
    });
 
    test('handles API error and displays error message', async () => {
        (AssistantService.getChatCompletion as Mock).mockRejectedValue(new Error('Erro na API'));
        (LocalStorageService.getItem as Mock).mockReturnValue('dummy-token');

        render(<Chatbot />);

    const buttons2 = await waitFor(() => screen.getAllByRole('button'));
    console.log('Botões encontrados:', buttons2.map(b => b.textContent));
    const openButton2 = buttons2[0];
    await userEvent.click(openButton2);

        await userEvent.type(screen.getByPlaceholderText('Digite sua mensagem...'), 'How are you?');
        await userEvent.click(screen.getByRole('button', { name: /enviar/i }));

        await waitFor(() => {
            expect(screen.getByText('Ocorreu um erro ao consultar a API. Por favor, tente novamente.')).toBeInTheDocument();
            expect(ChatHistoryManager.saveMessage).toHaveBeenCalledWith(expect.objectContaining({
                sender: 'bot',
                text: 'Ocorreu um erro ao consultar a API. Por favor, tente novamente.'
            }));
        });
    });

    test('displays authentication alert if user is not authenticated', async () => {
        (LocalStorageService.getItem as Mock).mockReturnValue(null);

        render(<Chatbot />);

    const buttons3 = await waitFor(() => screen.getAllByRole('button'));
    console.log('Botões encontrados:', buttons3.map(b => b.textContent));
    const openButton3 = buttons3[0];
    await userEvent.click(openButton3);

        await userEvent.type(screen.getByPlaceholderText('Digite sua mensagem...'), 'How are you?');
        await userEvent.click(screen.getByRole('button', { name: /enviar/i }));

        await waitFor(() => {
            expect(screen.getByText('Para utilizar o assistente, você precisa fazer login.')).toBeInTheDocument();
            expect(ChatHistoryManager.saveMessage).toHaveBeenCalledTimes(0); // Verifica se nenhuma mensagem foi salva
            expect(ChatHistoryManager.saveMessage).not.toHaveBeenCalledWith(expect.objectContaining({
                sender: 'user',
                text: 'How are you?'
            }));
        });
    });

    test('clears chat history', async () => {
        render(<Chatbot />);

    const buttons4 = await waitFor(() => screen.getAllByRole('button'));
    console.log('Botões encontrados:', buttons4.map(b => b.textContent));
    const openButton4 = buttons4[0];
    await userEvent.click(openButton4);

        await userEvent.click(screen.getByText('Limpar Histórico'));

        await waitFor(() => {
            expect(ChatHistoryManager.clearChatHistory).toHaveBeenCalled();
        });
    });

    test('does not add welcome messages if chat history exists', async () => {
        const messages: IMessage[] = [
            { sender: 'user', text: 'Hello', id: '1', token: '' },
        ];
        (ChatHistoryManager.getChatHistory as Mock).mockReturnValue(messages);

        render(<Chatbot />);

    const buttons5 = await waitFor(() => screen.getAllByRole('button'));
    console.log('Botões encontrados:', buttons5.map(b => b.textContent));
    const openButton5 = buttons5[0];
    await userEvent.click(openButton5);

        await waitFor(() => {
            expect(screen.getByText('Hello')).toBeInTheDocument();
            expect(screen.queryByText('Olá! Eu sou seu assistente virtual. Como posso ajudar você hoje?')).not.toBeInTheDocument();
        });
    });
});
