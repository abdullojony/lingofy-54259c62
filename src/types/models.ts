
export interface Subject {
  id: number;
  name: string;
  icon: string;
  progress: number;
  isNew?: boolean;
}

export interface Language extends Subject {
  flagEmoji: string;
}

export interface Module {
  id: number;
  title: string;
  type: 'video' | 'quiz' | 'reading' | 'practice';
  isCompleted: boolean;
  isActive: boolean;
  subject: string;
}
