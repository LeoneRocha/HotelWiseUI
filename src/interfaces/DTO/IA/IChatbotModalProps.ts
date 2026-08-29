import { IMessage } from "../../model/IA/IAskAssistantResponse";

export interface IChatbotModalProps {
    messages: IMessage[];
    isTyping: boolean;
    showAlert: boolean;
    input: string;
    handleSubmit: (e: React.SubmitEvent<HTMLFormElement>) => void;
    handleClearHistory: () => void;
    setInput: (input: string) => void;
    toggleModal: () => void;
  }

  export interface IChatMessageProps {
    message: IMessage;
  }