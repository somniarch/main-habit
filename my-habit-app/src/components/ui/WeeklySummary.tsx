// components/WeeklySummary.tsx
"use client";
import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { useLanguage } from "@/contexts/LanguageContext";

const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false }
);
const BarChart = dynamic(
  () => import("recharts").then((m) => m.BarChart),
  { ssr: false }
);
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), { ssr: false });
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), { ssr: false });

// x축 레이블: 월~일 → 번역 키 사용
const DAY_LABEL_KEYS = [
  'day.short.monday',
  'day.short.tuesday',
  'day.short.wednesday',
  'day.short.thursday',
  'day.short.friday',
  'day.short.saturday',
  'day.short.sunday',
] as const;

interface Routine {
  date: string;    // "YYYY-MM-DD" 형식, 스케줄된 날짜
  done: boolean;
  rating: number;
  isHabit?: boolean;
}

interface Props {
  routines: Routine[];
  currentDate: string; // "YYYY-MM-DD"
}

export default function WeeklySummary({ routines, currentDate }: Props) {
  const { t } = useLanguage();
  const weeklyData = useMemo(() => {
    const [yy, mm, dd] = currentDate.split("-").map(Number);
    const today = new Date(yy, mm - 1, dd);

    const jsDay = today.getDay();
    const monOffset = (jsDay + 6) % 7;
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - monOffset);

    console.log(`[Stats] Current date: ${currentDate}, Week start: ${weekStart.toISOString().split('T')[0]}`);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);

      const Y = d.getFullYear();
      const M = String(d.getMonth() + 1).padStart(2, "0");
      const D = String(d.getDate()).padStart(2, "0");
      const isoDate = `${Y}-${M}-${D}`;
      const label = t(DAY_LABEL_KEYS[i]);

      // 루틴의 date(행동 실제 날짜)만을 기준으로 집계 (이미 date로만 필터링, 주석 명확화)
      const items = routines.filter((r) => r.date === isoDate); // date가 행동 실제 날짜
      const total = items.length;
      const doneCount = items.filter((r) => r.done).length;
      const totalCompletion = total
        ? Math.round((doneCount / total) * 100)
        : 0;
      const totalSatisfaction = doneCount
        ? Math.round(
            items
              .filter((r) => r.done)
              .reduce((sum, r) => sum + r.rating, 0) /
              doneCount
          )
        : 0;

      const routinesOnly = items.filter((r) => !r.isHabit);
      const rCnt = routinesOnly.length;
      const rDone = routinesOnly.filter((r) => r.done).length;
      const routineCompletion = rCnt
        ? Math.round((rDone / rCnt) * 100)
        : 0;
      const routineSatisfaction = rDone
        ? Math.round(
            routinesOnly
              .filter((r) => r.done)
              .reduce((s, r) => s + r.rating, 0) /
              rDone
          )
        : 0;

      const habitsOnly = items.filter((r) => r.isHabit);
      const hCnt = habitsOnly.length;
      const hDone = habitsOnly.filter((r) => r.done).length;
      const habitCompletion = hCnt
        ? Math.round((hDone / hCnt) * 100)
        : 0;
      const habitSatisfaction = hDone
        ? Math.round(
            habitsOnly
              .filter((r) => r.done)
              .reduce((s, r) => s + r.rating, 0) /
              hDone
          )
        : 0;

      console.log(`[Stats] ${label} (${isoDate}): Total=${total}, Done=${doneCount}, Completion=${totalCompletion}%`);

      return {
        name: label,
        totalCompletion,
        totalSatisfaction,
        routineCompletion,
        routineSatisfaction,
        habitCompletion,
        habitSatisfaction,
      };
    });
  }, [routines, currentDate, t]);

  // [라벨, 데이터키, 타입] → 번역 키 사용
  const charts = [
    [t('chart.total.completion'), "totalCompletion", "percent"],
    [t('chart.routine.completion'), "routineCompletion", "percent"],
    [t('chart.habit.completion'), "habitCompletion", "percent"],
    [t('chart.total.satisfaction'), "totalSatisfaction", "score"],
    [t('chart.routine.satisfaction'), "routineSatisfaction", "score"],
    [t('chart.habit.satisfaction'), "habitSatisfaction", "score"],
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-4">
      {charts.map(([label, key, type]) => (
        <div key={key} className="space-y-1">
          <h4 className="text-center font-medium">{`${t('chart.weekly.prefix')} ${label}`}</h4>
          <div className="w-full h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="name" />
                <YAxis domain={type === "score" ? [0, 10] : [0, 100]} />
                <Tooltip />
                <Bar dataKey={key} fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  );
}
