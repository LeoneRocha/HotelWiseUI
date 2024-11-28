import { Message } from "./AskAssistantResponse";

export interface ChatbotModalProps {
    messages: Message[];
    isTyping: boolean;
    showAlert: boolean;
    input: string;
    handleSubmit: (e: React.FormEvent) => void;
    handleClearHistory: () => void;
    setInput: (input: string) => void;
    toggleModal: () => void;
  }

  export interface ChatMessageProps {
    message: Message;
  }