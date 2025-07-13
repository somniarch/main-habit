export type Routine = {
  id?: number;
  date: string; 
  day: string;
  start: string;
  end: string;
  task: string;
  done: boolean;
  rating: number;
  isHabit?: boolean;
  createdAt?: string;
  updatedAt?: string;
};

export type User = {
  id: string;
  pw: string;
};

export type Toast = {
  message: string;
  emoji: string;
};

export type NewRoutine = {
  start: string;
  end: string;
  task: string;
};

export type TabType = "routine-habit" | "tracker" | "today-diary";

export type DiaryLogs = Record<string, string[]>;
export type DiarySummaries = Record<string, string>;
export type DiaryImages = Record<string, string>;
export type GeneratedFlags = Record<string, boolean>; 

export type Language = 'ko' | 'en';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
} 