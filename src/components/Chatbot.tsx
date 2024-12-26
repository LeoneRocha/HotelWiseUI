// Chatbot.tsx
import React, { useState, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import ChatHistoryManager from '../services/chatHistoryManager';
import AssistantService from '../services/assistantService';
import Button from 'react-bootstrap/Button';
import ChatbotModal from './ChatbotModal';
import '../css/Chatbot.css';
import DOMPurify from 'dompurify';
import { IMessage } from '../interfaces/IAskAssistantResponse';
import LocalStorageService from '../services/localStorageService';
import { nameStorageTokenJWT } from '../auth-config';

const Chatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<IMessage[]>(ChatHistoryManager.getChatHistory());
  const [show, setShow] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  // Inicializar nextId com o valor do maior ID + 1
  const getNextId = () => {
    if (messages.length === 0) return 1;
    const maxId = Math.max(...messages.map((msg) => parseInt(msg.id)));
    return maxId + 1;
  };

  const [nextId, setNextId] = useState(getNextId());

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const isAuthenticated = useCallback(() => {
    const token = LocalStorageService.getItem(nameStorageTokenJWT);
    return !!token;
  }, []);

  const addMessage = useCallback((sender: 'user' | 'bot', text: string, id?: number) => {
    const messageId = id ?? nextId; // Use o ID fornecido ou o nextId
    const newMessage: IMessage = { id: messageId.toString(), sender, text };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    ChatHistoryManager.saveMessage(newMessage);
    setNextId((prevId) => prevId + 1); // Incrementa o ID para a próxima mensagem
  }, [nextId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAlert(false);
    if (!input.trim()) return;

    if (!isAuthenticated()) {
      setShowAlert(true);
      setInput(''); // Clear input field
      return;
    }

    const userMessageId = getNextId();
    addMessage('user', input, userMessageId);
    setNextId(userMessageId + 1);

    setIsTyping(true);
    setInput(''); // Clear input field

    try {
      const response = await AssistantService.getChatCompletion({ maxHotelRetrieve: 0, searchTextCriteria: input });
      const sanitizedResponse = DOMPurify.sanitize(response[0].response);
      const botMessageId = getNextId() + 1;
      addMessage('bot', sanitizedResponse, botMessageId);
      setNextId((prevId) => prevId + 1);
    } catch (error) {
      console.error('Erro ao consultar a API de chat completion:', error);
      const botErrorMessageId = getNextId() + 1;
      addMessage('bot', 'Ocorreu um erro ao consultar a API. Por favor, tente novamente.', botErrorMessageId);
      setNextId((prevId) => prevId + 1);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    ChatHistoryManager.clearChatHistory();
    setMessages([]);
    setNextId(1); // Reset the ID counter when clearing history
  };

  const toggleModal = () => {
    setShow((prevShow) => {
      if (!prevShow && messages.length === 0) {
        addMessage('bot', 'Olá! Eu sou seu assistente virtual. Como posso ajudar você hoje?', 1);
        addMessage('bot', 'Posso ajudar com várias tarefas, como responder perguntas, dar dicas e suporte, ou simplesmente bater um papo. O que você precisa?', 2);
        setNextId(3); // Ajustar nextId para o próximo valor após mensagens iniciais
      }
      return !prevShow;
    });
  };

  return (
    <div className="chatbot-container">
      <Button variant="primary" onClick={toggleModal} className="chatbot-toggle" aria-controls="chat-container" aria-expanded={show}>
        {show ? 'Fechar' : 'Fale com o assistente'}
      </Button>
      {show && (isMobile ? (
        <ChatbotModal
          messages={messages}
          isTyping={isTyping}
          showAlert={showAlert}
          input={input}
          handleSubmit={handleSubmit}
          handleClearHistory={handleClearHistory}
          setInput={setInput}
          toggleModal={toggleModal}
        />
      ) : (
        <Draggable>
          <ChatbotModal
            messages={messages}
            isTyping={isTyping}
            showAlert={showAlert}
            input={input}
            handleSubmit={handleSubmit}
            handleClearHistory={handleClearHistory}
            setInput={setInput}
            toggleModal={toggleModal}
          />
        </Draggable>
      ))}
    </div>
  );
};

export default Chatbot;
