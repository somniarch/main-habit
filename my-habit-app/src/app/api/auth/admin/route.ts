import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId, password } = await request.json();

    if (!userId || !password) {
      return NextResponse.json(
        { success: false, message: "관리자 ID와 비밀번호가 필요합니다." },
        { status: 400 }
      );
    }

    // 환경변수에서 관리자 계정 확인
    const adminUserId = process.env.ADMIN_USER_ID;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminUserId || !adminPassword) {
      console.error("관리자 환경변수가 설정되지 않았습니다.");
      return NextResponse.json(
        { success: false, message: "서버 설정 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // 관리자 인증 확인
    if (userId === adminUserId && password === adminPassword) {
      return NextResponse.json({
        success: true,
        message: "관리자 로그인 성공",
        isAdmin: true,
        userId: userId
      });
    } else {
      return NextResponse.json(
        { success: false, message: "관리자 계정이 아닙니다." },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("관리자 인증 오류:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 