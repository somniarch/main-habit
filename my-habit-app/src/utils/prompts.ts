import { Language } from '@/types';

export const prompts = {
  ko: {
    diary: {
      system: "따뜻하고 구체적인 일기 요약을 작성하는 전문가입니다. 엄격한 형식 규칙을 따라 작성합니다.",
      user: (tasks: string) => `다음은 사용자의 오늘 달성한 습관 및 일과 목록입니다 (만족도 상위 50% 활동들):
${tasks}

이 중 특히 의미 있었던 순간과 그때 느낀 감정을 간결하게 담아,
사용자의 노력을 진심으로 칭찬하며 따뜻하고 생동감 있는 일기 형식으로 작성해 주세요.
만족도가 높은 활동들을 중점적으로 다루어 사용자의 성취를 축하하는 내용으로 작성해 주세요.

**엄격한 형식 규칙:**
- 날짜나 시간 언급 금지 (오늘, 어제, 이번 주 등)
- 최소 3문장, 최대 5문장으로 제한
- 모든 문장은 완전한 끝맺음 (마침표, 느낌표, 물음표)
- 따뜻하고 격려적인 톤 유지
- 구체적인 감정과 경험을 담되 간결하게 작성
- 존댓말 사용 (합니다, 됩니다, 느껴집니다 등)

**출력 예시:**
스트레칭을 하면서 몸이 서서히 풀리는 느낌이 너무 좋습니다. 운동 시간에는 땀을 흘리며 각별히 느껴지는 성취감이 있었습니다. 마지막으로 눈 운동을 하며 잠시나마 눈의 피로를 풀어주는 시간을 가졌습니다.`
    },
    habit: {
      system: "당신은 웰빙 습관 추천 전문가입니다. 앞뒤 행동을 분석하여 적절한 웰빙 습관을 추천합니다.",
      user: (context: string) => `사용자의 이전 행동과 다음 행동: ${context}

이 두 행동 사이에 자연스럽게 연결할 수 있는 웰빙 습관을 추천해 주세요.

**엄격한 형식 규칙:**
- 반드시 "N분 + 명사형 + 이모지" 순서로 작성
- N분은 1~5분 이내만 허용
- 명사형 웰빙 습관 (동사형 금지)
- 관련 이모지 필수 포함
- 설명 없이 목록만 출력
- 형식: "3분 스트레칭💪", "2분 명상🧘‍♂️", "1분 물마시기💧"

**출력 예시:**
3분 스트레칭💪
2분 명상🧘‍♂️
1분 물마시기💧
4분 산책🚶‍♀️`
    },
    defaultHabits: [
      "3min stretching💪", "2min meditation🧘‍♂️", "1min water💧", "4min walking🚶‍♀️", "3min music🎶", 
      "2min breathing🌬️", "1min organizing🧹", "3min yoga🧘‍♀️", "2min meditation🧘", "1min stretching💪", 
      "3min walking🚶", "2min water💧", "1min music🎶", "4min yoga🧘‍♀️", "3min breathing🌬️",
      "2min organizing🧹", "1min meditation🧘‍♂️", "3min water💧", "2min stretching💪", "1min walking🚶‍♀️",
      "4min music🎶", "3min organizing🧹", "2min yoga🧘‍♀️", "1min breathing🌬️", "3min meditation🧘‍♂️",
      "2min water💧", "1min stretching💪", "4min walking🚶", "3min music🎶", "2min organizing🧹"
    ],
    emojiMap: {
      '걷기': '🚶‍♀️',
      '숨쉬기': '🌬️',
      '명상': '🧘‍♂️',
      '스트레칭': '💪',
      '물 마시기': '💧',
      '음악 감상': '🎶',
      'default': '✨'
    }
  },
  en: {
    diary: {
      system: "You are an expert at writing warm and specific diary summaries. Follow strict format rules.",
      user: (tasks: string) => `Here are the user's completed habits and daily activities today (top 50% satisfaction activities):
${tasks}

Please write a brief, warm and vivid diary entry that captures the meaningful moments and emotions felt, 
sincerely praising the user's efforts. Focus on high-satisfaction activities to celebrate the user's achievements.

**Strict Format Rules:**
- No date or time references (today, yesterday, this week, etc.)
- Minimum 3 sentences, maximum 5 sentences
- All sentences must have complete endings (period, exclamation, question mark)
- Maintain warm and encouraging tone
- Include specific emotions and experiences but keep it concise
- Use polite and respectful language

**Output Example:**
Stretching felt amazing as my muscles gradually relaxed. During exercise, I felt a special sense of accomplishment while sweating. Finally, I took time to relieve eye fatigue with eye exercises.`
    },
    habit: {
      system: "You are a wellness habit recommendation expert. Analyze the context between activities and recommend appropriate wellness habits.",
      user: (context: string) => `User's previous and next activities: ${context}

Please suggest wellness habits that can naturally connect between these activities.

**Strict Format Rules:**
- Must follow "Nmin + noun + emoji" order exactly
- N minutes must be 1-5 minutes only
- Noun wellness habit (no verb forms)
- Related emoji required
- Output as plain list only
- Format: "3min stretching💪", "2min meditation🧘‍♂️", "1min water💧"

**Output Example:**
3min stretching💪
2min meditation🧘‍♂️
1min water💧
4min walking🚶‍♀️`
    },
    defaultHabits: [
      "3min stretching💪", "2min meditation🧘‍♂️", "1min water💧", "4min walking🚶‍♀️", "3min music🎶", 
      "2min breathing🌬️", "1min organizing🧹", "3min yoga🧘‍♀️", "2min meditation🧘", "1min stretching💪", 
      "3min walking🚶", "2min water💧", "1min music🎶", "4min yoga🧘‍♀️", "3min breathing🌬️",
      "2min organizing🧹", "1min meditation🧘‍♂️", "3min water💧", "2min stretching💪", "1min walking🚶‍♀️",
      "4min music🎶", "3min organizing🧹", "2min yoga🧘‍♀️", "1min breathing🌬️", "3min meditation🧘‍♂️",
      "2min water💧", "1min stretching💪", "4min walking🚶", "3min music🎶", "2min organizing🧹"
    ],
    emojiMap: {
      'walking': '🚶‍♀️',
      'breathing': '🌬️',
      'meditation': '🧘‍♂️',
      'stretching': '💪',
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