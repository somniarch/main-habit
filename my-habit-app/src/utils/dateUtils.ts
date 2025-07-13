const fullDays = ["월", "화", "수", "목", "금", "토", "일"];

export function formatWeekLabel(date: Date, weekNum: number) {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yy}.${mm}.${dd}.W${weekNum}`;
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