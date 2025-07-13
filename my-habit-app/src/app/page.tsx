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
import { fetchHabitSuggestions, generateSummaryAI, generateImageAI } from "@/services/aiService";
import { TabType, DiaryLogs, DiarySummaries, GeneratedFlags } from "@/types";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSelector } from "@/components/ui/LanguageSelector";

export default function Page() {
  const { isLoggedIn, userId, login, logout } = useAuth();
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

  const [habitSuggestionIdx, setHabitSuggestionIdx] = useState<number | string | null>(null);
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

  const [diaryLoading, setDiaryLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<Record<string, string>>({});

  // 번역된 요일 배열
  const translatedDays = getTranslatedDays(t);
  const dayLetters = translatedDays.map((d) => d[0]);

  // 로컬 스토리지 저장
  useEffect(() => {
    if (userId) {
      localStorage.setItem(`todayDiaryLogs_${userId}`, JSON.stringify(todayDiaryLogs));
    }
  }, [todayDiaryLogs, userId]);

  // AI 일기 생성 (로딩 상태 반영)
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
        
        console.log(`[Diary] Day: ${day}, Date: ${iso}, Completed: ${count}, Tasks:`, completed);
        
        if (count >= 5 && !generated5[day]) {
          console.log(`[Diary] Generating summary for ${day} (5+ tasks)`);
          setGenerated5(prev => ({ ...prev, [day]: true }));
          setDiaryLoading(true);
          
          // 만족도 상위 50% 이내의 행동들을 우선 선택
          const highSatisfactionTasks = routines
            .filter(r => r.date === iso && r.done && r.rating >= 5) // 만족도 5점 이상
            .sort((a, b) => b.rating - a.rating) // 만족도 높은 순으로 정렬
            .slice(0, Math.ceil(count * 0.5)) // 상위 50%
            .map(r => r.task);
          
          const tasksForSummary = highSatisfactionTasks.length > 0 ? highSatisfactionTasks : completed;
          console.log(`[Diary] High satisfaction tasks for ${day}:`, tasksForSummary);
          
          const summary = await generateSummaryAI(iso, tasksForSummary, language);
          console.log(`[Diary] Summary for ${day}:`, summary);
          setDiarySummariesAI(prev => ({ ...prev, [iso]: summary }));
          setDiaryLoading(false);
        } else if (count >= 10 && !generated10[day]) {
          console.log(`[Diary] Generating summary for ${day} (10+ tasks)`);
          setGenerated10(prev => ({ ...prev, [day]: true }));
          setDiaryLoading(true);
          
          // 만족도 상위 50% 이내의 행동들을 우선 선택
          const highSatisfactionTasks = routines
            .filter(r => r.date === day && r.done && r.rating >= 5) // 만족도 5점 이상
            .sort((a, b) => b.rating - a.rating) // 만족도 높은 순으로 정렬
            .slice(0, Math.ceil(count * 0.5)) // 상위 50%
            .map(r => r.task);
          
          const tasksForSummary = highSatisfactionTasks.length > 0 ? highSatisfactionTasks : completed;
          console.log(`[Diary] High satisfaction tasks for ${day}:`, tasksForSummary);
          
          const summary = await generateSummaryAI(day, tasksForSummary, language);
          console.log(`[Diary] Summary for ${day}:`, summary);
          setDiarySummariesAI(prev => ({ ...prev, [day]: summary }));
          setDiaryLoading(false);
        }
      }
    })();
  }, [routines, todayDiaryLogs, generated5, generated10, currentDate, language]);

  // 그림 생성 로딩 상태도 필요하다면 비슷하게 setImageLoading 사용


  const handleLogout = () => {
    logout();
    setToast({ emoji: "👋", message: t('message.logout.success') });
  };

  const handleAddRoutine = () => {
    if (!isLoggedIn) {
      alert(t('login.required'));
      return;
    }
    addRoutine(currentDate, selectedDay); // 이미 선택한 날짜로 추가
  };

  const handleToggleDone = async (routineId: number) => {
    if (!isLoggedIn) return alert(t('login.required'));
    // 선택한 날짜와 요일 기준으로 해당 루틴을 찾아서 업데이트
    const updatedRoutine = await toggleDone(routineId, currentDate, selectedDay);
    if (!updatedRoutine?.done) return;

    const { emoji, msg } = getEncouragementAndHabit(updatedRoutine.task);
    setToast({ emoji, message: `${msg} "${updatedRoutine.task}"!` });
    setHabitSuggestionIdx(routines.findIndex(r => r.id === routineId));

    setTodayDiaryLogs((prev) => {
      const dayLogs = prev[selectedDay] || [];
      if (!dayLogs.includes(updatedRoutine.task)) {
        return {
          ...prev,
          [selectedDay]: [...dayLogs, updatedRoutine.task],
        };
      }
      return prev;
    });
  };

  const handleSetRating = async (routineId: number, rating: number) => {
    if (!isLoggedIn) return alert(t('login.required'));
    await setRating(routineId, rating, currentDate, selectedDay);
  };

  const handleFetchHabitSuggestions = async (routineId: number | string) => {
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

  const handleAddHabitBetween = async (routineId: number | string, habit: string) => {
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
    // 로그인 시 오늘 날짜/요일로 이동 (명확하게 보장)
    const today = new Date();
    setCurrentDate(today);
    const todayIdx = today.getDay(); // 일요일=0, 월=1...
    setSelectedDay(fullDays[todayIdx === 0 ? 6 : todayIdx - 1]);
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
                {(() => {
                  const routinesOfDay = routines.filter((r) => r.day === selectedDay);
                  const items: React.ReactNode[] = [];
                  for (let i = 0; i < routinesOfDay.length; i++) {
                    const routine = routinesOfDay[i];
                    const routineKey = routine.id !== undefined ? routine.id : i;
                    items.push(
                      <RoutineItem
                        key={routineKey}
                        routine={routine}
                        globalIndex={routineKey}
                        onToggleDone={handleToggleDone}
                        onSetRating={handleSetRating}
                      />
                    );
                    // 루틴 사이(마지막 전까지만)에만 버튼/추천 UI
                    if (i < routinesOfDay.length - 1) {
                      items.push(
                        <div key={`habit-btn-${i}`} className="text-center my-2">
                          {habitSuggestionIdx === routineKey ? (
                            <div className="p-3 bg-blue-50 rounded space-y-2 relative">
                              <button
                                onClick={handleCloseHabitSuggestions}
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
                                  {aiHabitSuggestions.map((habit, idx) => (
                                    <button
                                      key={idx}
                                      onClick={() => {
                                        handleAddHabitBetween(routineKey, habit);
                                        handleCloseHabitSuggestions();
                                      }}
                                      className="rounded-full bg-gray-300 px-3 py-1 hover:bg-gray-400"
                                    >
                                      {habit}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            <button
                              onClick={() => handleFetchHabitSuggestions(routineKey)}
                              className="rounded-full bg-gray-300 px-3 py-1 hover:bg-gray-400"
                              aria-label="습관 추천 열기"
                            >
                              + 습관 추천
                            </button>
                          )}
                        </div>
                      );
                    }
                  }
                  return items;
                })()}
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
                
                // 만족도 상위 50% 이내의 행동들을 우선 선택
                const highSatisfactionRoutines = routines
                  .filter(r => r.date === iso && r.done && r.rating >= 5) // 만족도 5점 이상
                  .sort((a, b) => b.rating - a.rating) // 만족도 높은 순으로 정렬
                  .slice(0, Math.ceil(completedTasks.length * 0.5)) // 상위 50%
                  .map(r => r.task);
                
                const tasksForImage = highSatisfactionRoutines.length > 0 ? highSatisfactionRoutines : completedTasks;
                console.log(`[Diary Display] High satisfaction tasks for image:`, tasksForImage);
                
                // 로딩 상태 분리 (예시: diaryLoading, imageLoading)
                if (diaryLoading) {
                  return <div className="text-center text-lg">{language === 'en' ? 'Writing diary summary ... 📝' : '일기 요약 작성중입니다 ... 📝'}</div>;
                }
                const diaryDateStr = `${iso}(${selectedDay})`;
                const summary = diarySummariesAI[iso] || warmSummary(completedTasks);
                
                // 요약이 있으면 자동으로 그림 생성
                if (summary && summary !== warmSummary(completedTasks)) {
                  // 그림 자동 생성 로직을 별도 함수로 분리
                  const generateImageIfNeeded = () => {
                    if (summary && !generatedImages[iso] && !imageLoading) {
                      setImageLoading(true);
                      generateImageAI(summary, tasksForImage)
                        .then(imageUrl => {
                          if (imageUrl) {
                            setGeneratedImages(prev => ({ ...prev, [iso]: imageUrl }));
                            console.log(`[Diary] Auto-generated image URL:`, imageUrl);
                          }
                        })
                        .catch(error => {
                          console.error(`[Diary] Auto image generation error:`, error);
                        })
                        .finally(() => {
                          setImageLoading(false);
                        });
                    }
                  };
                  
                  // 컴포넌트 렌더링 시 한 번만 실행
                  if (!generatedImages[iso] && !imageLoading) {
                    generateImageIfNeeded();
                  }
                  
                  return (
                    <div key={selectedDay} className="mb-6">
                      <h3 className="font-semibold">{diaryDateStr}</h3>
                      <p className="mb-2 whitespace-pre-line">{summary}</p>
                      {imageLoading && (
                        <div className="text-center text-lg mt-4">
                          {language === 'en' ? 'Generating image ... 🎨' : '그림 생성중입니다 ... 🎨'}
                        </div>
                      )}
                      {generatedImages[iso] && (
                        <div className="mt-4 text-center">
                          <img src={generatedImages[iso]} alt="Generated diary image" className="mx-auto max-w-full rounded" />
                        </div>
                      )}
                    </div>
                  );
                }
                
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
