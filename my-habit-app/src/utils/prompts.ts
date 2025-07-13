import { Language } from '@/types';

export const prompts = {
  ko: {
    diary: {
      system: "따뜻하고 구체적인 일기 요약을 작성하는 전문가입니다.",
      user: (tasks: string) => `다음은 사용자의 오늘 달성한 습관 및 일과 목록입니다:
${tasks}

이 중 특히 의미 있었던 순간과 그때 느낀 감정을 간결하게 담아,
사용자의 노력을 진심으로 칭찬하며 따뜻하고 생동감 있는 일기 형식으로 짧게 요약해 주세요.`
    },
    habit: {
      system: "당신은 웰빙 습관 추천 전문가입니다.",
      user: (context: string) => `사용자의 이전 행동과 다음 행동: ${context}
이 행동들 사이에 자연스럽게 연결할 수 있는 짧은 웰빙 습관을
1) 형식: N분(1~5분) + 활동 + 이모지
2) 공백 포함 12자 이내
3) 3개 이상 5개 이하
4) 리스트 기호, 설명 등 불필요한 요소 없음
5) 활동은 모두 한국어 명사형으로만 작성
예시: 3분 스트레칭💪`
    },
    defaultHabits: ["3분 스트레칭", "2분 숨쉬기", "1분 정리"],
    emojiMap: {
      '걷기': '🚶‍♀️',
      '숨쉬기': '🌬️',
      '명상': '🧘‍♂️',
      '스트레칭': '🤸‍♀️',
      '물 마시기': '💧',
      '음악 감상': '🎶',
      'default': '✨'
    }
  },
  en: {
    diary: {
      system: "You are an expert at writing warm and specific diary summaries.",
      user: (tasks: string) => `Here are the user's completed habits and daily activities today:
${tasks}

Please write a brief, warm and vivid diary entry that captures the meaningful moments and emotions felt, 
sincerely praising the user's efforts. Keep it concise and engaging.`
    },
    habit: {
      system: "You are a wellness habit recommendation expert.",
      user: (context: string) => `User's previous and next activities: ${context}
Please suggest short wellness habits that can naturally connect between these activities:
1) Format: N minutes (1-5 min) + activity + emoji
2) Within 12 characters including spaces
3) 3-5 suggestions
4) No list symbols, explanations, or unnecessary elements
5) Activities should be in English noun form only
Example: 3min stretching💪`
    },
    defaultHabits: ["3min stretching", "2min breathing", "1min organizing"],
    emojiMap: {
      'walking': '🚶‍♀️',
      'breathing': '🌬️',
      'meditation': '🧘‍♂️',
      'stretching': '🤸‍♀️',
      'drinking water': '💧',
      'music': '🎶',
      'default': '✨'
    }
  }
};

export function getPrompt(language: Language, type: 'diary' | 'habit', context?: string): { system: string; user: string } {
  const langPrompts = prompts[language];
  
  if (type === 'diary') {
    return {
      system: langPrompts.diary.system,
      user: langPrompts.diary.user(context || '')
    };
  } else {
    return {
      system: langPrompts.habit.system,
      user: langPrompts.habit.user(context || '')
    };
  }
}

export function getDefaultHabits(language: Language): string[] {
  return prompts[language].defaultHabits;
}

export function getEmojiMap(language: Language): Record<string, string> {
  return prompts[language].emojiMap;
} 