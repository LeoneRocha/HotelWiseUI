export interface IAskAssistantResponse {
    message: string;
    token: string;
  }

  export interface IMessage {
     id: string;
    sender: 'user' | 'bot';
    text: string;
    token: string;
} 