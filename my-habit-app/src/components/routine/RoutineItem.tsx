import React from "react";
import { Routine } from "@/types";

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
    </React.Fragment>
  );
} 