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

const Chatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<IMessage[]>(ChatHistoryManager.getChatHistory());
  const [show, setShow] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

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
    const token = LocalStorageService.getItem('token');
    return !!token;
  }, []);

  const addMessage = useCallback((sender: 'user' | 'bot', text: string) => {
    const newMessage: IMessage = { sender, text };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    ChatHistoryManager.saveMessage(newMessage);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAlert(false);
    if (!input.trim()) return;

    if (!isAuthenticated()) {
      setShowAlert(true);
      setInput(''); // Clear input field
      return;
    }

    addMessage('user', input);
    setIsTyping(true);
    setInput(''); // Clear input field

    try {
      const response = await AssistantService.getChatCompletion({ maxHotelRetrieve: 0, searchTextCriteria: input });
      const sanitizedResponse = DOMPurify.sanitize(response[0].response);
      addMessage('bot', sanitizedResponse);
    } catch (error) {
      console.error('Erro ao consultar a API de chat completion:', error);
      addMessage('bot', 'Ocorreu um erro ao consultar a API. Por favor, tente novamente.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleClearHistory = () => {
    ChatHistoryManager.clearChatHistory();
    setMessages([]);
  };

  const toggleModal = () => {
    setShow((prevShow) => {
      if (!prevShow && messages.length === 0) {
        addMessage('bot', 'Olá! Eu sou seu assistente virtual. Como posso ajudar você hoje?');
        addMessage('bot', 'Posso ajudar com várias tarefas, como responder perguntas, dar dicas e suporte, ou simplesmente bater um papo. O que você precisa?');
      }
      return !prevShow;
    });
  };

  return (
    <div className="chatbot-container">
      <Button variant="primary" onClick={toggleModal} className="chatbot-toggle" aria-controls="chat-container">
        {show ? 'Fechar' : 'Fale com o assistente'}
      </Button>
      {show && (isMobile ? <ChatbotModal
        messages={messages}
        isTyping={isTyping}
        showAlert={showAlert}
        input={input}
        handleSubmit={handleSubmit}
        handleClearHistory={handleClearHistory}
        setInput={setInput}
        toggleModal={toggleModal}
      />
        : <Draggable>
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
        </Draggable>)}
    </div>
  );
};

export default Chatbot;