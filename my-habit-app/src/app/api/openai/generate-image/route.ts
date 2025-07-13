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

    const { prompt, language = 'ko', activities = [] } = await request.json();

    // 언어별 프롬프트 생성
    let finalPrompt = '';
    if (language === 'en') {
      finalPrompt = `A warm, cozy colored pencil illustration with soft textures and subtle shading, resembling hand-drawn diary art.\nGentle, muted colors like orange, yellow, brown, and green.\nThe composition should feel peaceful and heartwarming, like a moment captured in a personal journal.\nNo humans should appear in the image.\nThe drawing should evoke quiet satisfaction and mindfulness.\n\nFocus on: ${prompt}\nActivities today: ${activities.join(', ')}`;
    } else {
      finalPrompt = `따뜻하고 포근한 색연필 느낌의 일러스트, 부드러운 질감과 은은한 명암, 손그림 일기 느낌.\n오렌지, 노랑, 갈색, 연두 등 부드러운 색상.\n구성은 평화롭고 마음이 따뜻해지는, 일기장에 기록된 한 장면처럼.\n사람은 등장하지 않음.\n그림은 조용한 만족감과 마음챙김을 느끼게 해야 함.\n\n중점: ${prompt}\n오늘의 활동: ${activities.join(', ')}`;
    }

    const cleanPrompt = sanitizeString(finalPrompt);

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