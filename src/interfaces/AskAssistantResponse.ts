export interface AskAssistantResponse {
    response: string;
  }

  export interface Message {
    sender: 'user' | 'bot';
    text: string;
}
