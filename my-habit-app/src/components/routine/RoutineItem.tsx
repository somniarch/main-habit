import React from "react";
import { Routine } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { formatTimeWithPeriod } from "@/utils/dateUtils";

interface RoutineItemProps {
  routine: Routine;
  globalIndex: number;
  onToggleDone: (index: number) => void;
  onSetRating: (index: number, rating: number) => void;
}

export function RoutineItem({
  routine,
  globalIndex,
  onToggleDone,
  onSetRating,
}: RoutineItemProps) {
  const { language } = useLanguage();
  return (
    <React.Fragment>
      <div className="border rounded p-4 flex justify-between items-center">
        <div>
          <span className="font-semibold">
            {routine.isHabit
              ? language === 'en'
                ? '[Well-being Habit]'
                : '[웰빙 습관]'
              : `[${formatTimeWithPeriod(routine.start, language)} - ${formatTimeWithPeriod(routine.end, language)}]`}
            {' '}{routine.task}
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
        <div className="mt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium text-gray-700">{language === 'en' ? 'Satisfaction' : '만족도'}</span>
            <div className="flex-1 flex items-center justify-between ml-4">
              <span className="text-xs text-gray-500">{language === 'en' ? 'Very Dissatisfied' : '매우 불만족'}</span>
              <span className="text-xs text-gray-500">{language === 'en' ? 'Very Satisfied' : '매우 만족'}</span>
            </div>
          </div>
          <div className="flex items-center gap-1 w-full">
            <span className="invisible">0</span>
            {[...Array(10).keys()].map((n) => (
              <button
                key={n}
                className={`px-2 rounded transition h-8 w-8 text-sm font-semibold ${
                  routine.rating === n + 1 ? "bg-black text-white" : "bg-gray-300 text-black hover:bg-gray-400"
                }`}
                onClick={() => onSetRating(globalIndex, n + 1)}
              >
                {n + 1}
              </button>
            ))}
            <span className="invisible">11</span>
          </div>
        </div>
      )}
    </React.Fragment>
  );
} 