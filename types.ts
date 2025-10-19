
export interface User {
  name: string;
  level: string;
  points: number;
  streak: number;
  progress: number;
  avatarUrl: string;
}

export interface TrainingModule {
  id: number;
  title: string;
  completed: boolean;
}

export interface ChatMessage {
  role: 'user' | 'model' | 'error';
  text: string;
}
