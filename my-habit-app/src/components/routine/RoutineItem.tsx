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
          <div className="flex items-center mb-1">
            <span className="text-sm font-medium text-gray-700 mr-4">{language === 'en' ? 'Satisfaction' : '만족도'}</span>
          </div>
          <div className="flex items-center w-full justify-between">
            <span className="text-xs text-gray-500 whitespace-nowrap mr-2">{language === 'en' ? 'Very Dissatisfied' : '매우 불만족'}</span>
            <div className="flex items-center gap-1 flex-1 justify-center overflow-x-auto flex-nowrap">
              {[...Array(10).keys()].map((n) => (
                <button
                  key={n}
                  className={`px-2 rounded transition h-7 w-8 text-sm font-semibold ${
                    routine.rating === n + 1 ? "bg-black text-white" : "bg-gray-300 text-black hover:bg-gray-400"
                  }`}
                  onClick={() => onSetRating(globalIndex, n + 1)}
                >
                  {n + 1}
                </button>
              ))}
            </div>
            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{language === 'en' ? 'Very Satisfied' : '매우 만족'}</span>
          </div>
        </div>
      )}
    </React.Fragment>
  );
} 