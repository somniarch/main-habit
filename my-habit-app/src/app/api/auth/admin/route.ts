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

    // 환경변수에서 관리자 계정들 확인
    const adminUserIds = process.env.ADMIN_USER_ID?.split(',').map(id => id.trim()) || [];
    const adminPasswords = process.env.ADMIN_PASSWORD?.split(',').map(pwd => pwd.trim()) || [];

    if (adminUserIds.length === 0 || adminPasswords.length === 0) {
      console.error("관리자 환경변수가 설정되지 않았습니다.");
      return NextResponse.json(
        { success: false, message: "서버 설정 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // 관리자 계정 수가 일치하는지 확인
    if (adminUserIds.length !== adminPasswords.length) {
      console.error("관리자 ID와 비밀번호 개수가 일치하지 않습니다.");
      return NextResponse.json(
        { success: false, message: "서버 설정 오류가 발생했습니다." },
        { status: 500 }
      );
    }

    // 관리자 인증 확인
    let isAuthenticated = false;
    for (let i = 0; i < adminUserIds.length; i++) {
      if (userId === adminUserIds[i] && password === adminPasswords[i]) {
        isAuthenticated = true;
        break;
      }
    }

    if (isAuthenticated) {
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