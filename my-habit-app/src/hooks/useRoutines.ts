import { useState, useEffect, useCallback } from "react";
import { Routine, NewRoutine } from "@/types";
import { getRealDate } from "@/utils/dateUtils";

export function useRoutines(userId: string) {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [newRoutine, setNewRoutine] = useState<NewRoutine>({ 
    start: "08:00", 
    end: "09:00", 
    task: "" 
  });

  // 루틴 조회
  const fetchRoutines = useCallback(async (date?: string) => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({ userId });
      if (date) params.append("date", date);
      
      const response = await fetch(`/api/routines?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setRoutines(data.routines);
      } else {
        setError(data.message);
      }
    } catch {
      setError("루틴을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  // 루틴 추가
  const addRoutine = async (currentDate: Date, selectedDay: string) => {
    if (!userId || !newRoutine.task.trim()) return;

    const isoDate = getRealDate(currentDate, selectedDay);
    
    const routineData = {
      date: isoDate,
      day: selectedDay,
      start: newRoutine.start,
      end: newRoutine.end,
      task: newRoutine.task,
      done: false,
      rating: 0,
      isHabit: false,
    };

    try {
      const response = await fetch("/api/routines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, routine: routineData }),
      });

      const data = await response.json();
      
      if (data.success) {
        setRoutines(prev => [...prev, data.routine]);
        setNewRoutine({ start: "08:00", end: "09:00", task: "" });
      } else {
        setError(data.message);
      }
    } catch {
      setError("루틴 추가 중 오류가 발생했습니다.");
    }
  };

  // 루틴 완료 상태 토글
  const toggleDone = async (routineId: number) => {
    try {
      const routine = routines.find(r => r.id === routineId);
      if (!routine) return;

      const response = await fetch("/api/routines", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          routineId, 
          updates: { done: !routine.done } 
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setRoutines(prev => 
          prev.map(r => r.id === routineId ? data.routine : r)
        );
        return data.routine;
      } else {
        setError(data.message);
      }
    } catch {
      setError("상태 변경 중 오류가 발생했습니다.");
    }
  };

  // 루틴 평점 설정
  const setRating = async (routineId: number, rating: number) => {
    try {
      const response = await fetch("/api/routines", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ routineId, updates: { rating } }),
      });

      const data = await response.json();
      
      if (data.success) {
        setRoutines(prev => 
          prev.map(r => r.id === routineId ? data.routine : r)
        );
      } else {
        setError(data.message);
      }
    } catch {
      setError("평점 설정 중 오류가 발생했습니다.");
    }
  };

  // 습관 추가
  const addHabitBetween = async (idx: number, habit: string, currentDate: Date, selectedDay: string) => {
    if (!userId) return;

    const isoDate = getRealDate(currentDate, selectedDay);
    
    const habitData = {
      date: isoDate,
      day: selectedDay,
      start: "(습관)",
      end: "",
      task: habit,
      done: false,
      rating: 0,
      isHabit: true,
    };

    try {
      const response = await fetch("/api/routines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, routine: habitData }),
      });

      const data = await response.json();
      
      if (data.success) {
        setRoutines(prev => {
          const newRoutines = [...prev];
          newRoutines.splice(idx + 1, 0, data.routine);
          return newRoutines;
        });
      } else {
        setError(data.message);
      }
    } catch {
      setError("습관 추가 중 오류가 발생했습니다.");
    }
  };

  // 루틴 삭제
  const deleteRoutine = async (routineId: number) => {
    try {
      const response = await fetch(`/api/routines?id=${routineId}`, {
        method: "DELETE",
      });

      const data = await response.json();
      
      if (data.success) {
        setRoutines(prev => prev.filter(r => r.id !== routineId));
      } else {
        setError(data.message);
      }
    } catch {
      setError("루틴 삭제 중 오류가 발생했습니다.");
    }
  };

  // 초기 로드
  useEffect(() => {
    if (userId) {
      fetchRoutines();
    }
  }, [userId, fetchRoutines]);

  return {
    routines,
    newRoutine,
    setNewRoutine,
    loading,
    error,
    addRoutine,
    toggleDone,
    setRating,
    addHabitBetween,
    deleteRoutine,
    fetchRoutines,
  };
} 