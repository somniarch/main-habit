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
  return (
    <div className="flex flex-col gap-2 mt-4">
      <div>{formatTimeWithPeriod(newRoutine.start, language)}</div>
      <input
        type="time"
        step={3600}
        value={newRoutine.start}
        onChange={(e) => onNewRoutineChange({ ...newRoutine, start: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <div>{formatTimeWithPeriod(newRoutine.end, language)}</div>
      <input
        type="time"
        step={3600}
        value={newRoutine.end}
        onChange={(e) => onNewRoutineChange({ ...newRoutine, end: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <input
        type="text"
        placeholder={t('routine.add') + ' 또는 ' + t('habit.suggestions') + ' 추가'}
        value={newRoutine.task}
        onChange={(e) => onNewRoutineChange({ ...newRoutine, task: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <button
        onClick={onAddRoutine}
        className="rounded-full bg-black text-white py-2 mt-2 w-full font-semibold hover:bg-gray-800 transition"
      >
        {t('add.routine')}
      </button>
    </div>
  );
} 