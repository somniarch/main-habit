import WeeklySummary from "@/components/WeeklySummary";

const dummyRoutines = [
  { date: "2025-07-08", done: true,  rating: 8, isHabit: false },
  { date: "2025-07-08", done: false, rating: 0, isHabit: false },
  { date: "2025-07-08", done: true,  rating: 7, isHabit: true  },
  { date: "2025-07-09", done: true,  rating: 9, isHabit: false },
  { date: "2025-07-09", done: false, rating: 0, isHabit: true  },
  { date: "2025-07-10", done: true,  rating: 6, isHabit: false },
  { date: "2025-07-10", done: true,  rating: 10, isHabit: false },
  { date: "2025-07-10", done: false, rating: 0, isHabit: true  },
  { date: "2025-07-11", done: false, rating: 0, isHabit: false },
  { date: "2025-07-11", done: true,  rating: 6, isHabit: true  },
  { date: "2025-07-12", done: true,  rating: 7, isHabit: false },
  { date: "2025-07-12", done: false, rating: 0, isHabit: false },
  { date: "2025-07-13", done: true,  rating: 9, isHabit: true  },
  { date: "2025-07-14", done: false, rating: 0, isHabit: true  },
];

export default function DummyWeeklyPage() {
  return (
    <WeeklySummary
      routines={dummyRoutines}
      currentDate="2025-07-10"
    />
  );
}
