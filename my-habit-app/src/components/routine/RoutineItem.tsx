import React from "react";
import { Routine } from "@/types";

interface RoutineItemProps {
  routine: Routine;
  globalIndex: number;
  onToggleDone: (index: number) => void;
  onSetRating: (index: number, rating: number) => void;
  onShowHabitSuggestions: (index: number) => void;
  habitSuggestionIdx: number | null;
  aiHabitSuggestions: string[];
  aiHabitLoading: boolean;
  aiHabitError: string | null;
  onAddHabitBetween: (index: number, habit: string) => void;
  onCloseHabitSuggestions: () => void;
}

export function RoutineItem({
  routine,
  globalIndex,
  onToggleDone,
  onSetRating,
  onShowHabitSuggestions,
  habitSuggestionIdx,
  aiHabitSuggestions,
  aiHabitLoading,
  aiHabitError,
  onAddHabitBetween,
  onCloseHabitSuggestions,
}: RoutineItemProps) {
  return (
    <React.Fragment>
      <div className="border rounded p-4 flex justify-between items-center">
        <div>
          <span className="font-semibold">
            [{routine.start} - {routine.end}] {routine.task}
          </span>
          {routine.done && <span className="ml-2 text-green-600 font-semibold">✔</span>}
        </div>
        <input
          type="checkbox"
          checked={routine.done}
          onChange={() => onToggleDone(globalIndex)}
        />
      </div>
      {routine.done && (
        <div className="mt-1 flex gap-1 flex-wrap">
          {[...Array(10).keys()].map((n) => (
            <button
              key={n}
              className={`px-2 rounded ${
                routine.rating === n + 1 ? "bg-black text-white" : "bg-gray-300 text-black"
              }`}
              onClick={() => onSetRating(globalIndex, n + 1)}
            >
              {n + 1}
            </button>
          ))}
        </div>
      )}
      {habitSuggestionIdx === globalIndex && (
        <div className="p-3 bg-blue-50 rounded space-y-2 relative">
          <button
            onClick={onCloseHabitSuggestions}
            className="absolute top-1 right-1 px-2 py-0.5 rounded hover:bg-gray-300"
            aria-label="습관 추천 닫기"
          >
            ✕
          </button>
          {aiHabitLoading ? (
            <p>추천 생성 중...</p>
          ) : aiHabitError ? (
            <p className="text-red-600">{aiHabitError}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {aiHabitSuggestions.map((habit, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onAddHabitBetween(globalIndex, habit);
                    onCloseHabitSuggestions();
                  }}
                  className="rounded-full bg-gray-300 px-3 py-1 hover:bg-gray-400"
                >
                  {habit}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
      {habitSuggestionIdx !== globalIndex && (
        <div className="text-center my-2">
          <button
            onClick={() => onShowHabitSuggestions(globalIndex)}
            className="rounded-full bg-gray-300 px-3 py-1 hover:bg-gray-400"
            aria-label="습관 추천 열기"
          >
            + 습관 추천
          </button>
        </div>
      )}
    </React.Fragment>
  );
} 