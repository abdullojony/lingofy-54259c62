
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
  // Added to support multiple module content types
  content?: {
    videoUrl?: string;
    description?: string;
    quizzes?: Quiz[];
    readingContent?: string[];
    practiceExercises?: string[];
  };
}

export interface Quiz {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  timestamp?: number; // For video embedded quizzes, time in seconds
}
