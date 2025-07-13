import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { success: false, message: "프롬프트가 필요합니다." },
        { status: 400 }
      );
    }

    // 프롬프트 정리 (유니코드 문자 제거)
    const cleanPrompt = prompt
      .replace(/[\u2028\u2029\u8232]/g, ' ') // 유니코드 줄바꿈 문자 제거
      .replace(/\s+/g, ' ') // 연속된 공백을 하나로
      .trim();

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: cleanPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0]?.url;

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