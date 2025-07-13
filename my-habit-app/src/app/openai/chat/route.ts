import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { getPrompt, getDefaultHabits, getEmojiMap } from "@/utils/prompts";
import { Language } from "@/types";

// 유니코드 특수문자 제거 함수 (더 강력한 버전)
function sanitizeString(str: string): string {
  if (!str) return "";
  return str
    .replace(/[\u0000-\u001F\u007F-\u009F\u2028\u2029\u8232\u8233]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// API 키 정리 (런타임에서 확인)
const apiKey = sanitizeString(process.env.OPENAI_API_KEY || "");

const openai = new OpenAI({ apiKey: apiKey });

// 유니코드 특수문자 제거 함수 (기존 함수 개선)
function sanitizeText(text: string): string {
  return sanitizeString(text)
    .replace(/\r\n/g, '\n') // Windows 줄바꿈을 Unix 줄바꿈으로 통일
    .replace(/\r/g, '\n'); // Mac 줄바꿈을 Unix 줄바꿈으로 통일
}

// Vercel에서 Node.js runtime 사용
export const runtime = "nodejs";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400"
};

// OPTIONS handler: CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: corsHeaders
  });
}

// GET handler: 안내 메시지 반환
export async function GET() {
  const msg = "Welcome to Habit Recommendation & Diary Summary API. Use POST with JSON body.";
  return new NextResponse(
    JSON.stringify({ message: msg }),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json; charset=utf-8"
      }
    }
  );
}

// POST handler: 습관 추천 or 일기 요약 분기
export async function POST(request: NextRequest) {
  try {
    // API 키 확인
    if (!apiKey) {
      return new NextResponse(
        JSON.stringify({ error: "OpenAI API 키가 설정되지 않았습니다." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" }
        }
      );
    }

    console.log("[API] POST request received");

    // Content-Type 확인
    const contentType = request.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      return new NextResponse(
        JSON.stringify({ error: "Content-Type must be application/json" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" }
        }
      );
    }

    // 요청 본문 파싱
    let body: { prevTask?: string; nextTask?: string; prompt?: string; language?: string };
    try {
      body = await request.json();
      console.log("[API] Request body:", body);
    } catch (parseError) {
      console.error("[API] JSON parse error:", parseError);
      return new NextResponse(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" }
        }
      );
    }

    // body에서 필요한 값들 구조분해
    const { prevTask, nextTask, prompt, language = 'ko' } = body;
    const selectedLanguage = language as Language;

    // 일기 요약 분기: prompt만 있을 때
    if (prompt && !prevTask && !nextTask) {
      console.log("[API] Diary summary mode");
      const sanitizedPrompt = sanitizeText(prompt);
      const { system, user } = getPrompt(selectedLanguage, 'diary', sanitizedPrompt);

      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ],
        temperature: 0.7,
        max_tokens: 200
      });

      // 원본 AI 응답
      const raw = completion.choices[0]?.message?.content ?? "";
      // "**오늘의 일기**" 헤더와 뒤따르는 줄바꿈 제거
      const withoutHeader = raw.replace(/^\*\*오늘의 일기\*\*\s*\r?\n?/i, "");
      // 앞뒤 공백 정리
      const summary = withoutHeader.trim();
      console.log("[API] Diary summary response:", summary);

      return new NextResponse(
        JSON.stringify({ success: true, result: summary }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json; charset=utf-8"
          }
        }
      );
    }

    // POST handler 안
if (prompt && !prevTask && !nextTask) {
  console.log("[API] Diary summary mode");
  const diaryPrompt = `다음은 사용자의 오늘 달성한 습관 및 일과 목록입니다:
${prompt}

이 중 특히 의미 있었던 순간과 그때 느낀 감정을 간결하게 담아,
사용자의 노력을 진심으로 칭찬하며 따뜻하고 생동감 있는 일기 형식으로 4줄 이내로 짧게 요약해 주세요.
추가적으로, 문장의 끝이 모두 마무리 되도록 써주세요.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "따뜻하고 구체적인 일기 요약을 작성하는 전문가입니다." },
      { role: "user", content: diaryPrompt }
    ],
    temperature: 0.7,
    max_tokens: 200
  });

  const summary = completion.choices[0]?.message?.content?.trim() ?? "";
  console.log("[API] Diary summary response:", summary);

  return new NextResponse(
    JSON.stringify({ success: true, result: summary }),
    {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json; charset=utf-8"
      }
    }
  );
}

    // 2) 습관 추천 분기: prevTask와 nextTask가 모두 있을 때만
    if (!prevTask || !nextTask) {
      return new NextResponse(
        JSON.stringify({ error: "이전 작업과 다음 작업이 모두 필요합니다 (prevTask, nextTask required)" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" }
        }
      );
    }

    console.log("[API] Habit recommendation mode. Context:", prevTask, nextTask);

    // 조합된 컨텍스트 생성
    const sanitizedPrevTask = prevTask ? sanitizeText(prevTask) : "";
    const sanitizedNextTask = nextTask ? sanitizeText(nextTask) : "";
    let context = "";
    if (selectedLanguage === 'en') {
      context = [
        sanitizedPrevTask ? `Previous: ${sanitizedPrevTask}` : "",
        sanitizedNextTask ? `Next: ${sanitizedNextTask}` : ""
      ].filter(Boolean).join(", ");
    } else {
      context = [
        sanitizedPrevTask ? `이전: ${sanitizedPrevTask}` : "",
        sanitizedNextTask ? `다음: ${sanitizedNextTask}` : ""
      ].filter(Boolean).join(", ");
    }
    // 프롬프트를 더 명확하게 전달
    const userPrompt =
      selectedLanguage === 'en'
        ? `${context}\nSuggest 3-5 wellness habits that can be done between these activities.\n- Format: Nmin + noun + emoji (e.g. 3min stretching💪)\n- Each habit must take 5 minutes or less.\n- Each must be a noun phrase with an emoji.\n- Each must be 16 characters or less.\n- Output as a plain list, no explanations.`
        : `${context}\n이 두 행동 사이에 할 수 있는 3~5개의 웰빙 습관을 추천해 주세요.\n- 형식: N분+명사+이모지 (예: 3분 스트레칭💪)\n- 각 습관은 5분 이내여야 합니다.\n- 반드시 명사+이모지 형태여야 합니다.\n- 각 항목은 16자 이내여야 합니다.\n- 설명 없이 목록만 출력해 주세요.`;
    const { system } = getPrompt(selectedLanguage, 'habit', context);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const text = completion.choices[0]?.message?.content?.trim() ?? "";
    console.log("[Habit API] OpenAI raw response:", text);

    // 1) 번호·불릿 제거, 패턴 필터링
    let suggestions = text
      .split(/\r?\n+/)
      .map(line =>
        line
          .replace(/^\s*\d+[\.\)]\s*/, "")   // "1. " 또는 "2) " 제거
          .replace(/^[-*]\s*/, "")          // 불릿 제거
          .trim()
      )
      // 엄격한 필터: N분(1~5분)+명사+이모지+16자 이내
      .filter(line => {
        const emojiRegex = /\p{Emoji}/u;
        const minPattern = selectedLanguage === 'en' ? /^(1|2|3|4|5)min\s*[^\d]+\p{Emoji}/u : /^(1|2|3|4|5)분\s*[^\d]+\p{Emoji}/u;
        return minPattern.test(line) && line.replace(/\s/g, '').length <= 16 && emojiRegex.test(line);
      });

    // 이모지 없는 항목은 자동 부여 (혹시라도 남아있을 경우)
    if (suggestions.length < 3) {
      const emojiMap = getEmojiMap(selectedLanguage);
      const emojiRegex = /\p{Emoji}/u;
      const minPattern = selectedLanguage === 'en' ? /^(1|2|3|4|5)min/ : /^(1|2|3|4|5)분/;
      const fallback = text.split(/\r?\n+/)
        .map(line => line.replace(/^\s*\d+[\.\)]\s*/, "").replace(/^[-*]\s*/, "").trim())
        .filter(line => minPattern.test(line) && line.replace(/\s/g, '').length <= 16)
        .map(item => {
          if (emojiRegex.test(item)) return item;
          for (const [key, emoji] of Object.entries(emojiMap)) {
            if (key !== 'default' && item.toLowerCase().includes(key.toLowerCase())) {
              return `${item}${emoji}`;
            }
          }
          return `${item}${emojiMap.default}`;
        });
      for (const f of fallback) {
        if (!suggestions.includes(f)) suggestions.push(f);
        if (suggestions.length >= 3) break;
      }
    }

    // 3~5개만 반환(미만이면 기본 후보 추가)
    const result = suggestions.slice(0, 5);
    if (result.length < 3) {
      const defaults = getDefaultHabits(selectedLanguage);
      const emojiMap = getEmojiMap(selectedLanguage);
      const emojiRegex = /\p{Emoji}/u;
      for (let i = 0; i < defaults.length && result.length < 3; i++) {
        let d = defaults[i];
        if (!emojiRegex.test(d)) {
          for (const [key, emoji] of Object.entries(emojiMap)) {
            if (key !== 'default' && d.toLowerCase().includes(key.toLowerCase())) {
              d = `${d}${emoji}`;
              break;
            }
          }
          if (!emojiRegex.test(d)) d = `${d}${emojiMap.default}`;
        }
        // 5분 이내+16자 이내만
        const minPattern = selectedLanguage === 'en' ? /^(1|2|3|4|5)min/ : /^(1|2|3|4|5)분/;
        if (minPattern.test(d) && d.replace(/\s/g, '').length <= 16 && !result.includes(d)) result.push(d);
      }
    }

    // JSON 형태로 반환
    return new NextResponse(
      JSON.stringify({ success: true, result }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json; charset=utf-8"
        }
      }
    );
  } catch (error: unknown) {
    console.error("[API] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    const stack = error instanceof Error ? error.stack : undefined;

    return new NextResponse(
      JSON.stringify({
        error: message,
        details: stack,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json; charset=utf-8" }
      }
    );
  }
}
