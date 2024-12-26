export interface IAskAssistantResponse {
    response: string;
  }

  export interface IMessage {
     id: string;
    sender: 'user' | 'bot';
    text: string;
}
