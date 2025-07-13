import { Language } from '@/types';

export const translations = {
  ko: {
    // 헤더 및 네비게이션
    'app.title': '습관 관리 앱',
    'login': '로그인',
    'logout': '로그아웃',
    'admin.panel': '관리자 패널',
    
    // 탭
    'tab.routine': '루틴 및 습관',
    'tab.diary': '오늘 일기',
    'tab.weekly': '통계',
    
    // 루틴 관련
    'add.routine': '루틴 추가',
    'start.time': '시작 시간',
    'end.time': '종료 시간',
    'task': '할 일',
    'save': '저장',
    'cancel': '취소',
    'delete': '삭제',
    'edit': '수정',
    
    // 습관 추천
    'habit.suggestions': '습관 추천',
    'add.habit': '습관 추가',
    'get.suggestions': '추천 받기',
    'close': '닫기',
    
    // 일기 관련
    'diary.summary': '오늘의 일기',
    'generate.summary': '일기 생성',
    'generate.image': '이미지 생성',
    
    // 주간 요약
    'weekly.summary': '주간 요약',
    'prev.week': '이전 주',
    'next.week': '다음 주',
    'export.csv': 'CSV 내보내기',
    
    // 메시지
    'hello': '안녕하세요',
    'login.success': '로그인 성공!',
    'admin.login.success': '관리자 로그인 성공!',
    'logout.success': '로그아웃 되었습니다.',
    'login.required': '로그인 후 이용해주세요.',
    'task.completed': '완료!',
    'habit.added': '습관이 추가되었습니다.',
    'error.occurred': '오류가 발생했습니다.',
    
    // 시간
    'today': '오늘',
    'yesterday': '어제',
    'tomorrow': '내일',
    
    // 요일
    'monday': '월요일',
    'tuesday': '화요일',
    'wednesday': '수요일',
    'thursday': '목요일',
    'friday': '금요일',
    'saturday': '토요일',
    'sunday': '일요일',
    
    // 등급
    'rating.excellent': '훌륭해요',
    'rating.good': '좋아요',
    'rating.okay': '괜찮아요',
    'rating.bad': '별로예요',
    'rating.terrible': '최악이에요',
  },
  en: {
    // Header & Navigation
    'app.title': 'Habit Management App',
    'login': 'Login',
    'logout': 'Logout',
    'admin.panel': 'Admin Panel',
    
    // Tabs
    'tab.routine': 'Routine & Habits',
    'tab.diary': 'Today\'s Diary',
    'tab.weekly': 'Statistics',
    
    // Routine related
    'add.routine': 'Add Routine',
    'start.time': 'Start Time',
    'end.time': 'End Time',
    'task': 'Task',
    'save': 'Save',
    'cancel': 'Cancel',
    'delete': 'Delete',
    'edit': 'Edit',
    
    // Habit suggestions
    'habit.suggestions': 'Habit Suggestions',
    'add.habit': 'Add Habit',
    'get.suggestions': 'Get Suggestions',
    'close': 'Close',
    
    // Diary related
    'diary.summary': 'Today\'s Diary',
    'generate.summary': 'Generate Summary',
    'generate.image': 'Generate Image',
    
    // Weekly summary
    'weekly.summary': 'Weekly Summary',
    'prev.week': 'Previous Week',
    'next.week': 'Next Week',
    'export.csv': 'Export CSV',
    
    // Messages
    'hello': 'Hello',
    'login.success': 'Login successful!',
    'admin.login.success': 'Admin login successful!',
    'logout.success': 'Logged out successfully.',
    'login.required': 'Please login to continue.',
    'task.completed': 'Completed!',
    'habit.added': 'Habit added successfully.',
    'error.occurred': 'An error occurred.',
    
    // Time
    'today': 'Today',
    'yesterday': 'Yesterday',
    'tomorrow': 'Tomorrow',
    
    // Days of week
    'monday': 'Monday',
    'tuesday': 'Tuesday',
    'wednesday': 'Wednesday',
    'thursday': 'Thursday',
    'friday': 'Friday',
    'saturday': 'Saturday',
    'sunday': 'Sunday',
    
    // Ratings
    'rating.excellent': 'Excellent',
    'rating.good': 'Good',
    'rating.okay': 'Okay',
    'rating.bad': 'Bad',
    'rating.terrible': 'Terrible',
  }
};

export function getTranslation(language: Language, key: string): string {
  const langTranslations = translations[language];
  return (langTranslations as Record<string, string>)[key] || key;
} 