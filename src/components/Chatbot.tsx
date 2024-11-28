import React, { useState, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import { saveMessage, getChatHistory, clearChatHistory } from '../services/chatHistoryManager';
import { getChatCompletion } from '../services/assistantService';
import Button from 'react-bootstrap/Button';
import ChatbotModal from './ChatbotModal';
import '../css/Chatbot.css';
import DOMPurify from 'dompurify';
import { Message } from '../interfaces/AskAssistantResponse'; 
import LocalStorageService from '../services/localStorageService';

const Chatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(getChatHistory());
  const [show, setShow] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
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

    // Check authentication status
    const token = LocalStorageService.getItem('token');
    setIsAuthenticated(!!token);
  }, [messages]);

  const addMessage = useCallback((sender: 'user' | 'bot', text: string) => {
    const newMessage: Message = { sender, text };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    saveMessage(newMessage);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAlert(false);
    if (!input.trim()) return;

    if (!isAuthenticated) {
      setShowAlert(true);
      setInput(''); // Clear input field
      return;
    }

    addMessage('user', input);
    setIsTyping(true);
    setInput(''); // Clear input field

    try {
      const response = await getChatCompletion({ maxHotelRetrieve: 0, searchTextCriteria: input });
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
    clearChatHistory();
    setMessages([]);
  };

  const toggleModal = () => {
    setShow((prevShow) => {
      if (!prevShow) {
        addMessage('bot', 'Olá! Eu sou seu assistente virtual. Como posso ajudar você hoje?');
        addMessage('bot', 'Posso ajudar com várias tarefas, como responder perguntas, dar dicas e suporte, ou simplesmente bater um papo. O que você precisa?');
      }
      return !prevShow;
    });
  };

  return (
    <div className="chatbot-container">
      <Button variant="primary" onClick={toggleModal} className="chatbot-toggle">
        {show ? 'Fechar' : 'Chat'}
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
                        : <Draggable><ChatbotModal 
                                        messages={messages} 
                                        isTyping={isTyping} 
                                        showAlert={showAlert} 
                                        input={input} 
                                        handleSubmit={handleSubmit} 
                                        handleClearHistory={handleClearHistory} 
                                        setInput={setInput} 
                                        toggleModal={toggleModal} 
                                      /></Draggable>)}
    </div>
  );
};

export default Chatbot;
