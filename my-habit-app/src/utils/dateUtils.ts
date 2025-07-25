const fullDays = ["월", "화", "수", "목", "금", "토", "일"];

export const fullDayKeys = [
  'day.short.monday',
  'day.short.tuesday',
  'day.short.wednesday',
  'day.short.thursday',
  'day.short.friday',
  'day.short.saturday',
  'day.short.sunday',
] as const;

// 번역된 요일 배열을 반환하는 함수
export function getTranslatedDays(t: (key: string) => string) {
  return fullDayKeys.map(key => t(key));
}

export function formatWeekLabel(date: Date) {
  // 월별 주차 계산
  const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const days = Math.floor((date.getTime() - startOfMonth.getTime()) / (24 * 60 * 60 * 1000));
  const weekOfMonth = Math.ceil((days + startOfMonth.getDay() + 1) / 7);
  
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd} (W${weekOfMonth})`;
}

export function formatDiaryDate(day: string, baseDate: Date, dayIndex: number) {
  const firstDayOfWeek = new Date(baseDate);
  firstDayOfWeek.setDate(baseDate.getDate() - baseDate.getDay() + dayIndex + 1);
  const yy = String(firstDayOfWeek.getFullYear()).slice(2);
  const mm = String(firstDayOfWeek.getMonth() + 1).padStart(2, "0");
  const dd = String(firstDayOfWeek.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}(${day})`;
}

export function formatMonthDay(date: Date, dayIndex: number) {
  const firstDayOfWeek = new Date(date);
  firstDayOfWeek.setDate(date.getDate() - date.getDay() + dayIndex + 1);
  const mm = String(firstDayOfWeek.getMonth() + 1).padStart(2, "0");
  const dd = String(firstDayOfWeek.getDate()).padStart(2, "0");
  return `${mm}/${dd}`;
}

export function getDayIndex(selectedDay: string): number {
  return fullDays.indexOf(selectedDay);
}

export function getRealDate(currentDate: Date, selectedDay: string): string {
  // 선택한 요일에 맞춰 해당 주의 실제 날짜를 계산한다.
  // JS의 getDay는 일요일을 0으로 반환하므로 월요일 기준으로 보정한다.

  const dayIdx = getDayIndex(selectedDay); // 월=0 ~ 일=6
  const realDate = new Date(currentDate);

  // 현재 날짜가 속한 주의 월요일을 구한 뒤 요일 인덱스를 더한다
  const jsDay = currentDate.getDay(); // 일=0, 월=1...
  const monOffset = (jsDay + 6) % 7; // 월요일 기준 오프셋
  realDate.setDate(currentDate.getDate() - monOffset + dayIdx);

  return realDate.toISOString().split("T")[0];
}

export function formatTimeWithPeriod(time: string, language: string): string {
  // time: "08:00" 또는 "13:00"
  const [hourStr, minute] = time.split(":");
  let hour = parseInt(hourStr, 10);
  let period = "";
  if (language === "en") {
    period = hour < 12 ? "AM" : "PM";
    hour = hour % 12 || 12;
    return `${period} ${hour.toString().padStart(2, "0")}:${minute}`;
  } else {
    period = hour < 12 ? "오전" : "오후";
    if (hour > 12) hour -= 12;
    return `${period} ${hour.toString().padStart(2, "0")}:${minute}`;
  }
}

export { fullDays }; 