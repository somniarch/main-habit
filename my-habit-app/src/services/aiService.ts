export async function fetchHabitSuggestions(
  prevTask: string | null,
  nextTask: string | null,
  language: string = 'ko'
): Promise<string[]> {
  try {
    const res = await fetch("/api/openai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prevTask, nextTask, language }),
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(errText || `Error ${res.status}`);
    }

    const data = await res.json();
    console.log("[fetchHabitSuggestions] JSON response:", data);

    if (!data.success || !data.result || !Array.isArray(data.result)) {
      throw new Error("추천 결과 포맷이 올바르지 않습니다.");
    }

    let suggestions = data.result
      .map((item: string) => item.replace(/^\s*\d+\)\s*/, ""))
      .slice(0, 5);

    if (suggestions.length < 3) {
      const habitCandidates = ["깊은 숨 2분", "물 한잔", "짧은 산책", "스트레칭"];
      const fill = habitCandidates.filter(h => !suggestions.includes(h));
      suggestions = suggestions.concat(fill.slice(0, 3 - suggestions.length));
    }
    return suggestions;

  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "추천 중 오류 발생";
    throw new Error(msg);
  }
}

export async function generateSummaryAI(day: string, tasks: string[], language: string = 'ko'): Promise<string> {
  try {
    const res = await fetch("/api/openai/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: tasks.join(", "), language }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Summary AI error:", data);
      return "";
    }
    return data.result || "";
  } catch (e) {
    console.error(e);
    return "";
  }
}

export async function generateImageAI(promptBase: string, tasks: string[]): Promise<string> {
  try {
    // 프롬프트 길이 제한 (1000자 이내)
    const maxPromptLength = 800; // 여유분 확보
    const maxActivitiesLength = 200;
    
    // activities 길이 제한
    const activities = tasks.join(", ");
    const truncatedActivities = activities.length > maxActivitiesLength 
      ? activities.substring(0, maxActivitiesLength) + "..." 
      : activities;
    
    const prompt = `Colored pencil drawing style, hand-drawn diary art, soft textures, warm muted colors (orange, yellow, brown, green), peaceful journal illustration, no humans, no text, no letters, no words, cozy atmosphere, featuring the single most satisfying completed activity prominently with related objects clearly visible: ${truncatedActivities}`;
    
    // 최종 프롬프트 길이 확인
    if (prompt.length > maxPromptLength) {
      console.warn(`[Image AI] Prompt too long: ${prompt.length} chars, truncating...`);
      const truncatedPrompt = prompt.substring(0, maxPromptLength);
      console.log(`[Image AI] Final prompt length: ${truncatedPrompt.length} chars`);
    }
    const res = await fetch("/api/openai/generate-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (!res.ok) {
      console.error("Image AI error:", data);
      return "";
    }
    return data.imageUrl || "";
  } catch (e) {
    console.error(e);
    return "";
  }
} 