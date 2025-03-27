// ChatbotModal.tsx
import React from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';
import ChatMessage from './ChatMessage';
import { IChatbotModalProps } from '../interfaces/IChatbotModalProps';

const ChatbotModal: React.FC<IChatbotModalProps> = ({
  messages, isTyping, showAlert, input,
  handleSubmit, handleClearHistory, setInput, toggleModal
}) => (
  <div className="chatbot-modal" role="dialog" aria-labelledby="chatbot-title" aria-modal="true">
    <div className="chatbot-modal-header">
      <span id="chatbot-title">Assistente</span>
      <Button variant="link" onClick={toggleModal} className="chatbot-close" aria-label="Fechar">&times;</Button>
    </div>
    <div className="chat-messages" id="chat-container" aria-live="polite" aria-relevant="additions">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
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
        maxLength={500}
        aria-label="Digite sua mensagem"
      />
      <button type="submit">Enviar</button>
    </form>
    {showAlert && (
      <Alert variant="warning" className="login-alert" role="alert">
        Para utilizar o assistente, você precisa fazer login.
      </Alert>
    )}
    <Button onClick={handleClearHistory} className="clear-history-button" variant="light">
      Limpar Histórico
    </Button>
  </div>
);

export default ChatbotModal;
