export interface Challenge {
  id: string;
  label: string;
  target: number;
  current: number;
  reward: number;
  completed: boolean;
  lastGenerated: string;
}

export interface UserProfile {
  id: string;
  displayName: string;
  photoURL?: string;
  xp: number;
  level: number;
  coins: number;
  rank: string;
  achievements: string[];
  dailyStreak: number;
  lastActive: string;
  totalWins: number;
  totalGames: number;
  challenges?: Challenge[];
  settings?: {
    audio: boolean;
    notifications: boolean;
    darkMode: boolean;
    language: 'EN' | 'JP' | 'DE' | 'SO';
    securityProtocol: 'MANDATORY' | 'RELAXED';
  };
}

export interface Question {
  id?: string;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  difficulty: string;
  imageUrl?: string;
}

export type Category = 
  | "Football" 
  | "IQ" 
  | "Technology" 
  | "Science" 
  | "Somalia" 
  | "Islamic Knowledge" 
  | "Movies" 
  | "Math";

export type Difficulty = "Easy" | "Medium" | "Hard" | "Expert";

export interface GameState {
  currentQuestionIndex: number;
  questions: Question[];
  score: number;
  streak: number;
  timeLeft: number;
  isFinished: boolean;
  correctAnswers: number;
}
