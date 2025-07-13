import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// 사용자 목록 조회 (관리자용)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUserId = searchParams.get("adminUserId");

    if (!adminUserId) {
      return NextResponse.json(
        { success: false, message: "관리자 인증이 필요합니다." },
        { status: 401 }
      );
    }

    const admin = await prisma.user.findUnique({
      where: { userId: adminUserId },
      select: { isAdmin: true }
    });

    if (!admin || !admin.isAdmin) {
      return NextResponse.json(
        { success: false, message: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        userId: true,
        isAdmin: true,
        createdAt: true,
        _count: {
          select: {
            routines: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error("Get users error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 사용자 생성 (관리자용)
export async function POST(request: Request) {
  try {
    const { adminUserId, newUser } = await request.json();
    console.log("[Users API] POST request received:", { adminUserId, newUser: newUser?.userId });

    if (!adminUserId || !newUser) {
      console.log("[Users API] Missing required data");
      return NextResponse.json(
        { success: false, message: "필수 데이터가 누락되었습니다." },
        { status: 400 }
      );
    }

    const admin = await prisma.user.findUnique({
      where: { userId: adminUserId },
      select: { isAdmin: true }
    });

    console.log("[Users API] Admin check:", { adminUserId, admin });

    if (!admin || !admin.isAdmin) {
      console.log("[Users API] Admin permission denied:", { adminUserId, admin });
      return NextResponse.json(
        { success: false, message: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    // 기존 사용자 확인
    const existingUser = await prisma.user.findUnique({
      where: { userId: newUser.userId }
    });

    if (existingUser) {
      console.log("[Users API] User already exists:", newUser.userId);
      return NextResponse.json(
        { success: false, message: "이미 존재하는 사용자 ID입니다." },
        { status: 409 }
      );
    }

    const user = await prisma.user.create({
      data: {
        userId: newUser.userId,
        password: newUser.password,
        isAdmin: newUser.isAdmin || false
      }
    });

    console.log("[Users API] User created successfully:", user.userId);

    return NextResponse.json({ 
      success: true, 
      message: "사용자가 성공적으로 생성되었습니다.",
      user: {
        id: user.id,
        userId: user.userId,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error("[Users API] Create user error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 사용자 삭제 (관리자용)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const adminUserId = searchParams.get("adminUserId");
    const targetUserId = searchParams.get("targetUserId");

    if (!adminUserId || !targetUserId) {
      return NextResponse.json(
        { success: false, message: "필수 데이터가 누락되었습니다." },
        { status: 400 }
      );
    }

    const admin = await prisma.user.findUnique({
      where: { userId: adminUserId },
      select: { isAdmin: true }
    });

    if (!admin || !admin.isAdmin) {
      return NextResponse.json(
        { success: false, message: "관리자 권한이 필요합니다." },
        { status: 403 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { userId: targetUserId }
    });

    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "삭제할 사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    await prisma.user.delete({
      where: { userId: targetUserId }
    });

    return NextResponse.json({ 
      success: true, 
      message: "사용자가 성공적으로 삭제되었습니다." 
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 