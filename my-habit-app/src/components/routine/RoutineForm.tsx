import React from "react";
import { NewRoutine } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatTimeWithPeriod } from "@/utils/dateUtils";

interface RoutineFormProps {
  newRoutine: NewRoutine;
  onNewRoutineChange: (routine: NewRoutine) => void;
  onAddRoutine: () => void;
}

export function RoutineForm({ newRoutine, onNewRoutineChange, onAddRoutine }: RoutineFormProps) {
  const { language, t } = useLanguage();
  // 시간 placeholder 언어별 처리
  const getTimePlaceholder = (time: string) => {
    if (!time) return '';
    const [hourStr, minute] = time.split(":");
    let hour = parseInt(hourStr, 10);
    let period = '';
    if (language === 'en') {
      period = hour < 12 ? 'AM' : 'PM';
      hour = hour % 12 || 12;
      return `${period} ${hour.toString().padStart(2, '0')}:${minute}`;
    } else {
      period = hour < 12 ? '오전' : '오후';
      if (hour > 12) hour -= 12;
      return `${period} ${hour.toString().padStart(2, '0')}:${minute}`;
    }
  };
  return (
    <div className="flex flex-col gap-2 mt-4">
      <input
        type="time"
        step={3600}
        value={newRoutine.start}
        onChange={(e) => onNewRoutineChange({ ...newRoutine, start: e.target.value })}
        className="border rounded px-2 py-1"
        placeholder={getTimePlaceholder(newRoutine.start)}
      />
      <input
        type="time"
        step={3600}
        value={newRoutine.end}
        onChange={(e) => onNewRoutineChange({ ...newRoutine, end: e.target.value })}
        className="border rounded px-2 py-1"
        placeholder={getTimePlaceholder(newRoutine.end)}
      />
      <input
        type="text"
        placeholder={language === 'en' ? 'Routine Add' : '루틴 추가'}
        value={newRoutine.task}
        onChange={(e) => onNewRoutineChange({ ...newRoutine, task: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <button
        onClick={onAddRoutine}
        className="rounded-full bg-black text-white py-2 mt-2 w-full font-semibold hover:bg-gray-800 transition"
      >
        {language === 'en' ? 'Routine Add' : '루틴 추가'}
      </button>
    </div>
  );
} 