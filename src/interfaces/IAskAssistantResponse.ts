export interface IAskAssistantResponse {
    message: string;
  }

  export interface IMessage {
     id: string;
    sender: 'user' | 'bot';
    text: string;
} 