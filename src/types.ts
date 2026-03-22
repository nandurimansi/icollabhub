export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number | string;
  isError?: boolean;
  file?: {
    name: string;
    size: string;
    type: string;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
}
