// Chatbot.tsx
import React, { useState, useEffect } from 'react';
import Draggable from 'react-draggable';
import { saveMessage, getChatHistory, clearChatHistory, Message } from '../services/chatHistoryManager';
import { getChatCompletion } from '../services/assistantService';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import { FaRobot, FaUser } from 'react-icons/fa';
import '../css/Chatbot.css';
import DOMPurify from 'dompurify';

const Chatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>(getChatHistory());
  const [show, setShow] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { sender: 'user', text: input };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    saveMessage(userMessage);
    setInput('');

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
