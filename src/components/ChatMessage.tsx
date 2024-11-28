import React from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';
import { Message } from '../interfaces/AskAssistantResponse';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => (
  <div className={`chat-message ${message.sender}`}>
    {message.sender === 'bot' ? (
      <div className="bot-message">
        <FaRobot className="message-icon" />
        <span dangerouslySetInnerHTML={{ __html: message.text }} />
      </div>
    ) : (
      <div className="user-message">
        <FaUser className="message-icon" />
        <span>{message.text}</span>
      </div>
    )}
  </div>
);

export default ChatMessage;
