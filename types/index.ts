export type Message = {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: number;
};

export type ChatState = {
  messages: Message[];
  isLoading: boolean;
};