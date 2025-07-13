import { prisma } from "@/lib/prisma";

export async function initAdmins() {
  const adminIds = (process.env.NEXT_PUBLIC_ADMIN_USER_ID || "").split(",").map(id => id.trim());
  const adminPws = (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "").split(",").map(pw => pw.trim());

  for (let i = 0; i < adminIds.length; i++) {
    const userId = adminIds[i];
    const password = adminPws[i] || "";
    if (!userId) continue;
    const exists = await prisma.user.findUnique({ where: { userId } });
    if (!exists) {
      await prisma.user.create({
        data: { userId, password, isAdmin: true }
      });
    }
  }
}

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