export type MessageSender = 'user' | 'chatbot';
export type ChatTopic = 'troubleshooting' | 'compatibility' | 'value_estimate' | 'general' | 'repair';

export interface IChatMessage {
  sender: MessageSender;
  content: string;
  timestamp: Date;
}

export interface IChatSession {
  _id?: string;
  userId?: string; // Optional for unauthenticated users
  sessionId: string; // Unique session ID for tracking
  messages: IChatMessage[];
  topic?: ChatTopic;
  createdAt?: Date;
  updatedAt?: Date;
}

