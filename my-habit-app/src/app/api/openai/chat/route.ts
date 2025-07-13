import { NextResponse } from "next/server";
import OpenAI from "openai";

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

const openai = new OpenAI({
  apiKey: apiKey,
});

export async function POST(request: Request) {
  try {
    // API 키 확인
    if (!apiKey) {
      return NextResponse.json(
        { success: false, message: "OpenAI API 키가 설정되지 않았습니다." },
        { status: 500 }
      );
    }

    const { prevTask, nextTask } = await request.json();

    // 프롬프트 정리 (유니코드 문자 제거)
    const cleanPrompt = sanitizeString(`이전 작업: ${prevTask || "없음"}
다음 작업: ${nextTask || "없음"}

위 두 작업 사이에 수행할 수 있는 짧고 실용적인 습관을 3-5개 추천해주세요.
답변은 배열 형태로만 해주세요. 예시:
["깊은 숨 2분", "물 한잔", "짧은 산책"]`);
    const cleanSystem = sanitizeString("당신은 습관 추천 전문가입니다. 짧고 실용적인 습관만 추천해주세요.");

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: cleanSystem
        },
        {
          role: "user",
          content: cleanPrompt
        }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      return NextResponse.json(
        { success: false, message: "AI 응답을 받지 못했습니다." },
        { status: 500 }
      );
    }

    // 응답 정리
    const cleanResponse = sanitizeString(response);

    // 응답을 배열로 파싱
    let suggestions: string[] = [];
    try {
      // JSON 배열 형태로 파싱 시도
      suggestions = JSON.parse(cleanResponse);
    } catch {
      // JSON 파싱 실패 시 텍스트에서 추출
      const lines = cleanResponse.split('\n').filter((line: string) => line.trim());
      suggestions = lines
        .map((line: string) => line.replace(/^[\d\-\.\s]+/, '').trim())
        .filter((s: string) => s.length > 0)
        .slice(0, 5);
    }

    return NextResponse.json({ 
      success: true, 
      result: suggestions 
    });

  } catch (error) {
    console.error("OpenAI API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "AI 서비스에 일시적인 문제가 발생했습니다.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 