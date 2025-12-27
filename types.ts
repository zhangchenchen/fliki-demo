export interface User {
  id: string;
  name: string;
  avatar: string;
  points: number;
  loginStreak: number;
}

export interface EventData {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  posterUrl: string; // New for EventDetail static view
  brandName?: string; // For Sponsored events
  optionA: string;
  optionB: string;
  poolA: number;
  poolB: number;
  deadline: string;
  status: 'ongoing' | 'settled';
  winner?: 'A' | 'B';
  tags: string[];
}

export interface Bet { // Internally still Bet for logic, but UI will show 'Vote'
  id: string;
  eventId: string;
  side: 'A' | 'B';
  amount: number;
  potentialWin?: number;
  timestamp: string;
}

export interface Comment {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  side: 'A' | 'B';
  text: string;
  sticker?: string;
  timestamp: string;
}

export type ViewState = 'HOME' | 'PROFILE';