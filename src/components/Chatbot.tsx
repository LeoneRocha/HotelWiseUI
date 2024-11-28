import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { saveMessage, getChatHistory, clearChatHistory } from '../services/chatHistoryManager';
import { getChatCompletion } from '../services/assistantService';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import { FaRobot, FaUser } from 'react-icons/fa';
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

  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // Check authentication status
    const token = LocalStorageService.getItem('token');
    setIsAuthenticated(!!token);
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowAlert(false);
    if (!input.trim()) return;

    if (!isAuthenticated) {
      setShowAlert(true);
      setInput(''); // Clear input field
      return;
    }

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    saveMessage(userMessage);

    setIsTyping(true);

    try {
      const response = await getChatCompletion({
        maxHotelRetrieve: 0,
        searchTextCriteria: input,
      });
      const sanitizedResponse = DOMPurify.sanitize(response[0].response);
      const botMessage: Message = { sender: 'bot', text: sanitizedResponse };

      saveMessage(botMessage);
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error('Erro ao consultar a API de chat completion:', error);
      const errorMessage: Message = {
        sender: 'bot',
        text: 'Ocorreu um erro ao consultar a API. Por favor, tente novamente.',
      };

      saveMessage(errorMessage);
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsTyping(false);
      setInput(''); // Clear input field
    }
  };

  const handleClearHistory = () => {
    clearChatHistory();
    setMessages([]);
  };

  const toggleModal = () => setShow(!show);

  return (
    <div className="chatbot-container">
      <Button variant="primary" onClick={toggleModal} className="chatbot-toggle">
        {show ? 'Fechar' : 'Chat'}
      </Button>

      {show && (
        <Draggable>
          <div className="chatbot-modal">
            <div className="chatbot-modal-header">
              <span>Assistente</span>
              <Button variant="link" onClick={toggleModal} className="chatbot-close">&times;</Button>
            </div>
            <div className="chat-messages" id="chat-container">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.sender}`}>
                  {msg.sender === 'bot' ? (
                    <div className="bot-message">
                      <FaRobot className="message-icon" />
                      <span dangerouslySetInnerHTML={{ __html: msg.text }} />
                    </div>
                  ) : (
                    <div className="user-message">
                      <FaUser className="message-icon" />
                      <span>{msg.text}</span>
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="chat-message bot">
                  <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
                  <span> O robô está digitando...</span>
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="chat-input-form">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="chat-input"
              />
              <button type="submit">Enviar</button>
            </form>
            {showAlert && (
              <Alert variant="warning" className="login-alert">
                Para utilizar o assistente, você precisa fazer login.
              </Alert>
            )}
            <Button onClick={handleClearHistory} className="clear-history-button" variant="light">
              Limpar Histórico
            </Button>
          </div>
        </Draggable>
      )}
    </div>
  );
};

export default Chatbot;
