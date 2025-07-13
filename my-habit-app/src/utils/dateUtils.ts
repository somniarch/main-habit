const fullDays = ["월", "화", "수", "목", "금", "토", "일"];

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
  const dayIdx = getDayIndex(selectedDay);
  const realDate = new Date(currentDate);
  realDate.setDate(currentDate.getDate() - currentDate.getDay() + (dayIdx + 1));
  return realDate.toISOString().split("T")[0];
}

export { fullDays }; 