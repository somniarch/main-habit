import React from "react";
import { NewRoutine } from "@/types";

interface RoutineFormProps {
  newRoutine: NewRoutine;
  onNewRoutineChange: (routine: NewRoutine) => void;
  onAddRoutine: () => void;
}

export function RoutineForm({ newRoutine, onNewRoutineChange, onAddRoutine }: RoutineFormProps) {
  return (
    <div className="flex flex-col gap-2 mt-4">
      <input
        type="time"
        step={3600}
        value={newRoutine.start}
        onChange={(e) => onNewRoutineChange({ ...newRoutine, start: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <input
        type="time"
        step={3600}
        value={newRoutine.end}
        onChange={(e) => onNewRoutineChange({ ...newRoutine, end: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <input
        type="text"
        placeholder="루틴 또는 습관 추가"
        value={newRoutine.task}
        onChange={(e) => onNewRoutineChange({ ...newRoutine, task: e.target.value })}
        className="border rounded px-2 py-1"
      />
      <button
        onClick={onAddRoutine}
        className="rounded-full bg-black text-white py-2 mt-2 w-full font-semibold hover:bg-gray-800 transition"
      >
        추가
      </button>
    </div>
  );
} 