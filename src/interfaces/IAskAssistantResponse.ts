export interface IAskAssistantResponse {
    response: string;
  }

  export interface IMessage {
    sender: 'user' | 'bot';
    text: string;
}
