// ChatbotModal.tsx
import React, { useRef } from 'react';
import Draggable from 'react-draggable';
import { Spinner, Alert } from 'react-bootstrap';
import { FaRobot } from 'react-icons/fa';
import ChatMessage from './ChatMessage';
import { IChatbotModalProps } from '../../interfaces/DTO/IA/IChatbotModalProps';

const ChatbotModal: React.FC<IChatbotModalProps> = ({
  messages, isTyping, showAlert, input,
  handleSubmit, handleClearHistory, setInput, toggleModal
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <Draggable
      nodeRef={dialogRef as React.RefObject<HTMLElement>}
      handle=".chatbot-modal-header"
      cancel=".chatbot-close, input, button, textarea"
      bounds="body"
    >
      <dialog ref={dialogRef} className="chatbot-modal" open aria-labelledby="chatbot-title">
        <div className="chatbot-modal-header">
          <div className="chatbot-header-title-container">
            <div className="chatbot-header-icon">
              <FaRobot aria-hidden="true" />
            </div>
            <div>
              <span id="chatbot-title" className="chatbot-header-title">Assistente</span>
              <span className="chatbot-header-status">
                <span className="status-dot"></span> Online
              </span>
            </div>
          </div>
          <button type="button" onClick={toggleModal} className="chatbot-close" aria-label="Fechar">
            &times;
          </button>
        </div>
        <div className="chat-messages" id="chat-container" aria-live="polite" aria-relevant="additions">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isTyping && (
            <div className="chat-message bot">
              <div className="bot-message typing-indicator">
                <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="typing-text"> O robô está digitando...</span>
              </div>
            </div>
          )}
        </div>
        {showAlert && (
          <Alert variant="warning" className="login-alert" role="alert">
            Para utilizar o assistente, você precisa fazer login.
          </Alert>
        )}
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
          <button type="submit" className="chat-send-btn">Enviar</button>
        </form>
        <div className="chatbot-modal-footer">
          <button type="button" onClick={handleClearHistory} className="clear-history-button">
            Limpar Histórico
          </button>
        </div>
      </dialog>
    </Draggable>
  );
};

export default ChatbotModal;
