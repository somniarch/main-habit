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
  // 요일 기준이 아닌 실제 날짜 기준으로 수정
  // 선택한 날짜가 그대로 해당 날짜의 행동으로 저장됨
  // currentDate를 그대로 사용하여 요일 계산을 하지 않음
  
  // 현재 날짜를 그대로 사용 (요일 계산 없음)
  const realDate = new Date(currentDate);
  
  return realDate.toISOString().split("T")[0];
}

export { fullDays }; 