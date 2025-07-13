'use client';
import React, { useState, useEffect } from "react";
import WeeklySummary from "@/components/ui/WeeklySummary";
import { Toast } from "@/components/ui/Toast";
import { LoginForm } from "@/components/auth/LoginForm";
import { RoutineForm } from "@/components/routine/RoutineForm";
import { RoutineItem } from "@/components/routine/RoutineItem";
import { useAuth } from "@/hooks/useAuth";
import { useRoutines } from "@/hooks/useRoutines";
import { formatWeekLabel, formatMonthDay, fullDays, getTranslatedDays } from "@/utils/dateUtils";
import { getEncouragementAndHabit, warmSummary, habitCandidates } from "@/utils/encouragementUtils";
import { fetchHabitSuggestions, generateSummaryAI } from "@/services/aiService";
import { TabType, DiaryLogs, DiarySummaries, GeneratedFlags } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/ui/LanguageSelector";

export default function Page() {
  const { isLoggedIn, isAdmin, userId, login, logout } = useAuth();
  const { t, language } = useLanguage();
  
  const { 
    routines, 
    newRoutine, 
    setNewRoutine, 
    addRoutine, 
    toggleDone, 
    setRating, 
    addHabitBetween 
  } = useRoutines(userId);

  const [toast, setToast] = useState<{ message: string; emoji: string } | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState(fullDays[0]);
  const [selectedTab, setSelectedTab] = useState<TabType>("routine-habit");

  const [habitSuggestionIdx, setHabitSuggestionIdx] = useState<number | null>(null);
  const [todayDiaryLogs, setTodayDiaryLogs] = useState<DiaryLogs>(() => {
    if (typeof window === "undefined" || !userId) return {};
    const saved = localStorage.getItem(`todayDiaryLogs_${userId}`);
    return saved ? JSON.parse(saved) : {};
  });

  const [diarySummariesAI, setDiarySummariesAI] = useState<DiarySummaries>({});
  const [generated5, setGenerated5] = useState<GeneratedFlags>({});
  const [generated10, setGenerated10] = useState<GeneratedFlags>({});

  const [aiHabitSuggestions, setAiHabitSuggestions] = useState<string[]>([]);
  const [aiHabitLoading, setAiHabitLoading] = useState(false);
  const [aiHabitError, setAiHabitError] = useState<string | null>(null);

  // 번역된 요일 배열
  const translatedDays = getTranslatedDays(t);
  const dayLetters = translatedDays.map((d) => d[0]);

  // 로컬 스토리지 저장
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`todayDiaryLogs_${userId}`, JSON.stringify(todayDiaryLogs));
    }
  }, [todayDiaryLogs, userId]);

  // AI 일기 생성
  useEffect(() => {
    (async () => {
      for (const day of fullDays) {
        const dayIdx = fullDays.indexOf(day);
        const d = new Date(currentDate);
        d.setDate(currentDate.getDate() - currentDate.getDay() + (dayIdx + 1));
        const iso = d.toISOString().split("T")[0];

        const completed = routines
          .filter(r => r.date === iso && r.done)
          .map(r => r.task);
        const count = completed.length;

        if (count >= 5 && !generated5[day]) {
          setGenerated5(prev => ({ ...prev, [day]: true }));
          const summary = await generateSummaryAI(iso, completed, language);
          setDiarySummariesAI(prev => ({ ...prev, [iso]: summary }));
        } else if (count >= 10 && !generated10[day]) {
          setGenerated10(prev => ({ ...prev, [day]: true }));
          const summary = await generateSummaryAI(day, completed, language);
          setDiarySummariesAI(prev => ({ ...prev, [day]: summary }));
        }
      }
    })();
  }, [routines, todayDiaryLogs, generated5, generated10, currentDate, language]);



  const handleLogout = () => {
    logout();
    setToast({ emoji: "👋", message: t('message.logout.success') });
  };

  const handleAddRoutine = () => {
    if (!isLoggedIn) {
      alert(t('login.required'));
      return;
    }
    addRoutine(currentDate, selectedDay);
  };

  const handleToggleDone = async (routineId: number) => {
    if (!isLoggedIn) return alert(t('login.required'));
    
    const updatedRoutine = await toggleDone(routineId);
    if (!updatedRoutine?.done) return;

    const { emoji, msg } = getEncouragementAndHabit(updatedRoutine.task);
    setToast({ emoji, message: `${msg} "${updatedRoutine.task}"!` });
    setHabitSuggestionIdx(routines.findIndex(r => r.id === routineId));

    setTodayDiaryLogs((prev) => {
      const dayLogs = prev[updatedRoutine.day] || [];
      if (!dayLogs.includes(updatedRoutine.task)) {
        return {
          ...prev,
          [updatedRoutine.day]: [...dayLogs, updatedRoutine.task],
        };
      }
      return prev;
    });
  };

  const handleSetRating = async (routineId: number, rating: number) => {
    if (!isLoggedIn) return alert(t('login.required'));
    await setRating(routineId, rating);
  };

  const handleFetchHabitSuggestions = async (routineId: number) => {
    if (!isLoggedIn) {
      alert(t('login.required'));
      return;
    }
    
    setAiHabitLoading(true);
    setAiHabitError(null);

    try {
      const routineIndex = routines.findIndex(r => r.id === routineId);
      const prevTask = routineIndex > 0 ? routines[routineIndex - 1].task : null;
      const nextTask = routineIndex < routines.length - 1 ? routines[routineIndex + 1].task : null;
      const suggestions = await fetchHabitSuggestions(prevTask, nextTask, language);
      setAiHabitSuggestions(suggestions);
      setHabitSuggestionIdx(routineId);
    } catch (error) {
      setAiHabitError(error instanceof Error ? error.message : t('habit.suggestions.error'));
      setAiHabitSuggestions(habitCandidates.slice(0, 3));
    } finally {
      setAiHabitLoading(false);
    }
  };

  const handleAddHabitBetween = async (routineId: number, habit: string) => {
    const routineIndex = routines.findIndex(r => r.id === routineId);
    await addHabitBetween(routineIndex, habit, currentDate, selectedDay);
    setHabitSuggestionIdx(null);
  };

  const handleCloseHabitSuggestions = () => {
    setHabitSuggestionIdx(null);
    setAiHabitSuggestions([]);
    setAiHabitError(null);
  };

  const handleLogin = (userId: string, isAdmin: boolean) => {
    login(userId, isAdmin);
    setToast({ emoji: "✅", message: isAdmin ? t('message.admin.login.success') : t('message.login.success') });
  };

  const handlePrevWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() - 7 * 86400000));
  };

  const handleNextWeek = () => {
    setCurrentDate(new Date(currentDate.getTime() + 7 * 86400000));
  };

  const handleExportCSV = () => {
    const headers = ["Date","Day","Start","End","Task","Done","Rating","IsHabit"];
    const rows = routines.map(r => [
      r.date,
      r.day,
      r.start,
      r.end,
      `"${r.task.replace(/"/g,'""')}"`,
      r.done ? "Yes" : "No",
      String(r.rating),
      r.isHabit ? "Yes" : "No"
    ]);

    const csv = [headers, ...rows]
      .map(r => r.join(","))
      .join("\n");

    const blob = new Blob([`\ufeff${csv}`], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "all_habit_logs.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6 font-sans relative min-h-screen pb-8">
      {toast && <Toast emoji={toast.emoji} message={toast.message} onClose={() => setToast(null)} />}

      {!isLoggedIn ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <>
          <div className="flex justify-between items-center">
            <LanguageSelector />
            <div className="flex gap-2">
              <span className="text-sm text-gray-600">{t('hello')} {userId}</span>
              <button
                onClick={handleLogout}
                className="text-red-600 underline text-sm hover:text-red-800 transition"
              >
                {t('logout')}
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4">
            <button aria-label={t('nav.prev.week')} onClick={handlePrevWeek} className="px-3 py-1 text-lg font-bold">
              &lt;
            </button>
            <span className="font-semibold text-lg">{formatWeekLabel(currentDate)}</span>
            <button aria-label={t('nav.next.week')} onClick={handleNextWeek} className="px-3 py-1 text-lg font-bold">
              &gt;
            </button>
          </div>

          <div className="flex justify-center gap-3 mt-2">
            {dayLetters.map((letter, idx) => (
              <div key={letter + idx} className="flex flex-col items-center">
                <span className="text-xs text-gray-500">{formatMonthDay(currentDate, idx)}</span>
                <button
                  onClick={() => setSelectedDay(fullDays[idx])}
                  className={`rounded-full w-8 h-8 flex items-center justify-center font-semibold ${
                    selectedDay === fullDays[idx] ? "bg-black text-white" : "bg-gray-300 text-black"
                  }`}
                  aria-label={translatedDays[idx]}
                >
                  {letter}
                </button>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => setSelectedTab("routine-habit")}
              className={`rounded-full px-5 py-2 font-semibold transition ${
                selectedTab === "routine-habit" ? "bg-black text-white" : "bg-gray-300 text-black"
              }`}
            >
              {t('tab.routine')}
            </button>
            <button
              onClick={() => setSelectedTab("tracker")}
              className={`rounded-full px-5 py-2 font-semibold transition ${
                selectedTab === "tracker" ? "bg-black text-white" : "bg-gray-300 text-black"
              }`}
            >
              {t('tab.weekly')}
            </button>
            <button
              onClick={() => setSelectedTab("today-diary")}
              className={`rounded-full px-5 py-2 font-semibold transition ${
                selectedTab === "today-diary" ? "bg-black text-white" : "bg-gray-300 text-black"
              }`}
            >
              {t('tab.diary')}
            </button>
          </div>

          {selectedTab === "routine-habit" && (
            <div>
              <RoutineForm
                newRoutine={newRoutine}
                onNewRoutineChange={setNewRoutine}
                onAddRoutine={handleAddRoutine}
              />

              <div className="mt-6 space-y-4">
                {routines
                  .filter((r) => r.day === selectedDay)
                  .map((routine) => {
                    const globalIdx = routines.indexOf(routine);
                    return (
                      <RoutineItem
                        key={routine.id}
                        routine={routine}
                        globalIndex={globalIdx}
                        onToggleDone={handleToggleDone}
                        onSetRating={handleSetRating}
                        onShowHabitSuggestions={handleFetchHabitSuggestions}
                        habitSuggestionIdx={habitSuggestionIdx}
                        aiHabitSuggestions={aiHabitSuggestions}
                        aiHabitLoading={aiHabitLoading}
                        aiHabitError={aiHabitError}
                        onAddHabitBetween={handleAddHabitBetween}
                        onCloseHabitSuggestions={handleCloseHabitSuggestions}
                      />
                    );
                  })}
              </div>
            </div>
          )}
          
          {selectedTab === "tracker" && (
            <div className="mt-6">
              <h2 className="text-center font-semibold text-xl mb-4">{t('weekly.summary')}</h2>
              <WeeklySummary
                routines={routines}
                currentDate={currentDate.toISOString().split("T")[0]}
              />
              <button
                onClick={handleExportCSV}
                className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                {t('export.csv')}
              </button>
            </div>
          )}
          
          {selectedTab === "today-diary" && (
            <div className="mt-4 space-y-6 max-h-[480px] overflow-y-auto border rounded p-4 bg-gray-50 pb-8">
              <h2 className="text-center font-semibold text-xl mb-4">{t('diary.summary')}</h2>
              {(() => {
                const dayIdx = fullDays.indexOf(selectedDay);
                const d = new Date(currentDate);
                d.setDate(currentDate.getDate() - currentDate.getDay() + (dayIdx + 1));
                const iso = d.toISOString().split("T")[0];
              
                const completedTasks = routines
                  .filter(r => r.date === iso && r.done)
                  .map(r => r.task);
                
                if (completedTasks.length === 0) return null;
                if (completedTasks.length < 5) return null;
                
                const diaryDateStr = `${iso}(${selectedDay})`;
                const summary = diarySummariesAI[iso] || warmSummary(completedTasks);
                
                return (
                  <div key={selectedDay} className="mb-6">
                    <h3 className="font-semibold">{diaryDateStr}</h3>
                    <p className="mb-2 whitespace-pre-line">{summary}</p>
                  </div>
                );
              })()}
            </div>
          )}
        </>
      )}
    </div>
  );
}
