import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { initAdmins } from "@/types";

// 루틴 조회
export async function GET(request: Request) {
  await initAdmins(); // 어드민 계정 자동 등록
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const date = searchParams.get("date");

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "사용자 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { userId },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    const whereClause: Prisma.RoutineWhereInput = { userId: user.id };
    if (date) {
      whereClause.date = date;
    }

    const routines = await prisma.routine.findMany({
      where: whereClause,
      orderBy: [{ date: "asc" }, { start: "asc" }]
    });

    return NextResponse.json({ success: true, routines });
  } catch (error) {
    console.error("Get routines error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 루틴 생성
export async function POST(request: Request) {
  await initAdmins(); // 어드민 계정 자동 등록
  try {
    const { userId, routine } = await request.json();

    if (!userId || !routine) {
      return NextResponse.json(
        { success: false, message: "필수 데이터가 누락되었습니다." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { userId },
      select: { id: true }
    });

    let userIdNum = user?.id;
    if (!user) {
      // 자동 생성
      const newUser = await prisma.user.create({
        data: { userId, password: "", isAdmin: true }
      });
      userIdNum = newUser.id;
    }

    const newRoutine = await prisma.routine.create({
      data: {
        ...routine,
        userId: userIdNum
      }
    });

    return NextResponse.json({ success: true, routine: newRoutine });
  } catch (error) {
    console.error("Create routine error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 루틴 수정
export async function PUT(request: Request) {
  try {
    const { routineId, updates } = await request.json();

    if (!routineId) {
      return NextResponse.json(
        { success: false, message: "루틴 ID가 필요합니다." },
        { status: 400 }
      );
    }

    const updatedRoutine = await prisma.routine.update({
      where: { id: routineId },
      data: updates
    });

    return NextResponse.json({ success: true, routine: updatedRoutine });
  } catch (error) {
    console.error("Update routine error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

// 루틴 삭제
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const routineId = searchParams.get("id");

    if (!routineId) {
      return NextResponse.json(
        { success: false, message: "루틴 ID가 필요합니다." },
        { status: 400 }
      );
    }

    await prisma.routine.delete({
      where: { id: parseInt(routineId) }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete routine error:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
} 