import { NextRequest, NextResponse } from "next/server";
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

const openai = new OpenAI({ apiKey: apiKey });

// Vercel에서 Node.js runtime 사용
export const runtime = "nodejs";

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

    const { prompt } = await request.json();

    // aiService에서 이미 최적화된 프롬프트를 받으므로 그대로 사용
    const cleanPrompt = sanitizeString(prompt);

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