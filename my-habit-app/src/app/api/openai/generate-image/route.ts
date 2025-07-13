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

    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: "프롬프트가 필요합니다." },
        { status: 400 }
      );
    }

    // 프롬프트 정리 (유니코드 문자 제거)
    const cleanPrompt = sanitizeString(prompt);

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: cleanPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = Array.isArray(response.data) && response.data[0]?.url ? response.data[0].url : undefined;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, message: "이미지 생성에 실패했습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      imageUrl 
    });

  } catch (error) {
    console.error("OpenAI Image API error:", error);
    return NextResponse.json(
      { 
        success: false, 
        message: "이미지 생성 중 오류가 발생했습니다.",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
} 