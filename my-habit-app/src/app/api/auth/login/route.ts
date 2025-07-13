import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { userId, password } = await request.json();

    const user = await prisma.user.findUnique({ 
      where: { userId },
      select: {
        id: true,
        userId: true,
        password: true,
        isAdmin: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "사용자를 찾을 수 없습니다." }, 
        { status: 401 }
      );
    }

    // 비밀번호 검증 (실제 배포 시에는 bcrypt 사용)
    if (user.password !== password) {
      return NextResponse.json(
        { success: false, message: "비밀번호가 올바르지 않습니다." }, 
        { status: 401 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      userId: user.userId,
      isAdmin: user.isAdmin,
      userDbId: user.id
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." }, 
      { status: 500 }
    );
  }
}
