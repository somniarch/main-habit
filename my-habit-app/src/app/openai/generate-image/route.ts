import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// Node.js 런타임에서 실행 (이미지 생성에 필요한 openai 패키지 지원)
export const runtime = "nodejs";

// 유니코드 특수문자 제거 함수 (더 강력한 버전)
function sanitizeString(str: string): string {
  if (!str) return "";
  return str
    .replace(/[\u0000-\u001F\u007F-\u009F\u2028\u2029\u8232\u8233]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// CORS 설정
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Max-Age": "86400"
};

// CORS preflight 응답
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders
  });
}

// API 키 정리 (런타임에서 확인)
const apiKey = sanitizeString(process.env.OPENAI_API_KEY || "");

// OpenAI 클라이언트 초기화
const openai = new OpenAI({ apiKey: apiKey });

// POST: 그림 생성
export async function POST(request: NextRequest) {
  try {
    // API 키 확인
    if (!apiKey) {
      return new NextResponse(JSON.stringify({ error: "OpenAI API 키가 설정되지 않았습니다." }), {
        status: 500,
        headers: corsHeaders
      });
    }

    const { prompt, language = 'ko', activities = [] } = await request.json();

    // 언어별 프롬프트 생성 - 따뜻한 칭찬과 만족도 상위 행동 중점
    let finalPrompt = '';
    if (language === 'en') {
      finalPrompt = `A warm, cozy colored pencil illustration with soft textures and subtle shading, resembling hand-drawn diary art.\nGentle, muted colors like orange, yellow, brown, and green.\nThe composition should feel peaceful and heartwarming, like a moment captured in a personal journal.\nNo humans should appear in the image.\nThe drawing should evoke quiet satisfaction and mindfulness.\nFocus on activities that brought the most satisfaction (top 50% satisfaction level).\nCreate an image that celebrates and praises the user's achievements with warmth and encouragement.\n\nFocus on: ${prompt}\nActivities today: ${activities.join(', ')}`;
    } else {
      finalPrompt = `따뜻하고 포근한 색연필 느낌의 일러스트, 부드러운 질감과 은은한 명암, 손그림 일기 느낌.\n오렌지, 노랑, 갈색, 연두 등 부드러운 색상.\n구성은 평화롭고 마음이 따뜻해지는, 일기장에 기록된 한 장면처럼.\n사람은 등장하지 않음.\n그림은 조용한 만족감과 마음챙김을 느끼게 해야 함.\n만족도 상위 50%에 드는 활동들을 중점으로 표현.\n사용자의 성취를 따뜻하게 칭찬하고 격려하는 이미지로 제작.\n\n중점: ${prompt}\n오늘의 활동: ${activities.join(', ')}`;
    }

    const cleanPrompt = sanitizeString(finalPrompt);

    const response = await openai.images.generate({
      prompt: cleanPrompt,
      size: "256x256",
      n: 1,
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      return new NextResponse(JSON.stringify({ error: "No image URL returned from OpenAI" }), {
        status: 500,
        headers: corsHeaders
      });
    }

    return new NextResponse(JSON.stringify({ imageUrl }), {
      status: 200,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json; charset=utf-8"
      }
    });
  } catch (error: unknown) {
    console.error("[Image API] Error:", error);
    const message = error instanceof Error ? error.message : "Unknown error";
    return new NextResponse(JSON.stringify({ error: message }), {
      status: 500,
      headers: corsHeaders
    });
  }
}
