export function getEncouragementAndHabit(task: string) {
  const lower = task.toLowerCase();
  if (lower.includes("study") || lower.includes("read")) {
    return {
      emoji: "📚",
      msg: "학습에 집중했네요!",
      habitSuggestion: "5분간 뇌 휴식을 가져보세요",
    };
  }
  if (lower.includes("exercise") || lower.includes("walk")) {
    return {
      emoji: "🏃‍♂️",
      msg: "멋진 운동이에요!",
      habitSuggestion: "운동 후 수분 보충을 해보세요",
    };
  }
  if (lower.includes("meditate") || lower.includes("breathing")) {
    return {
      emoji: "🧘‍♀️",
      msg: "마음이 차분해지네요!",
      habitSuggestion: "명상 후 가벼운 스트레칭을 해보세요",
    };
  }
  return {
    emoji: "🎉",
    msg: "잘 해냈어요!",
    habitSuggestion: "물 한잔 마시기",
  };
}

export function warmSummary(entries: string[]) {
  if (entries.length < 5) return "";
  const firstFive = entries.slice(0, 5);
  return `오늘 당신은 ${firstFive.join(", ")} 등 다양한 일과를 멋지게 해냈어요.\n작은 습관 하나하나가 큰 변화를 만들어가고 있답니다.\n이 페이스를 유지하며 행복한 하루하루 보내길 응원할게요!`;
}

export const habitCandidates = ["깊은 숨 2분", "물 한잔", "짧은 산책", "스트레칭"]; 