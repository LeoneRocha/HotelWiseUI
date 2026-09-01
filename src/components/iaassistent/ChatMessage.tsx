// ChatMessage.tsx
import React from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';
import { IChatMessageProps } from '../../interfaces/DTO/IA/IChatbotModalProps'; 

const ChatMessage: React.FC<IChatMessageProps> = ({ message }) => (
  <div className={`chat-message ${message.sender}`} role="alert" aria-live="assertive">
    {message.sender === 'bot' ? (
      <div className="bot-message">
        <div className="message-icon-wrapper bot-icon-wrapper">
          <FaRobot className="message-icon" aria-label="Mensagem do assistente" />
        </div>
        <div className="message-content" dangerouslySetInnerHTML={{ __html: message.text }} />
      </div>
    ) : (
      <div className="user-message">
        <div className="message-icon-wrapper user-icon-wrapper">
          <FaUser className="message-icon" aria-label="Mensagem do usuário" />
        </div>
        <div className="message-content">{message.text}</div>
      </div>
    )}
  </div>
);

export default ChatMessage;
