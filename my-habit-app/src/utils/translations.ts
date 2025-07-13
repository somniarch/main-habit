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
    'message.login.success': '로그인 성공!',
    'message.admin.login.success': '관리자 로그인 성공!',
    'message.logout.success': '로그아웃 되었습니다.',
    'message.task.completed': '완료!',
    'message.habit.added': '습관이 추가되었습니다.',
    'message.error.occurred': '오류가 발생했습니다.',
    
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
    
    // 로그인 관련
    'login.required': '로그인 후 이용해주세요.',
    'login.title': '로그인 해주세요',
    'login.id': '아이디',
    'login.password': '비밀번호',
    'login.button': '로그인',
    'login.error.invalid': '등록된 사용자 ID 또는 비밀번호가 올바르지 않습니다.',
    'login.error.empty': '아이디와 비밀번호를 모두 입력해주세요.',
    'login.error.admin': '관리자 계정이 아닙니다.',
    'login.admin.mode': '관리자 모드',
    'login.normal.mode': '일반 로그인 모드로 전환',
    
    // 사용자 등록
    'register.new.user': '새 사용자',
    'register.new.user.id': '새 사용자 아이디',
    'register.new.user.password': '새 사용자 비밀번호',
    'register.error.exists': '이미 존재하는 아이디입니다.',
    'register.error.empty': '아이디와 비밀번호를 모두 입력해주세요.',
    
    // 관리자 패널
    'admin.panel.title': '관리자 패널',
    'admin.create.user': '새 사용자 생성',
    'admin.user.list': '사용자 목록',
    'admin.create.user.button': '사용자 생성',
    'admin.delete.user': '삭제',
    'admin.loading': '로딩 중...',
    'admin.error.create': '사용자 생성 중 오류가 발생했습니다.',
    'admin.error.load': '사용자 목록을 불러오는 중 오류가 발생했습니다.',
    'admin.error.delete': '사용자 삭제 중 오류가 발생했습니다.',
    'admin.confirm.delete': '정말로 이 사용자를 삭제하시겠습니까?',
    
    // 습관 추천
    'habit.suggestions.title': '습관 추천',
    'habit.suggestions.close': '습관 추천 닫기',
    'habit.suggestions.open': '습관 추천 열기',
    'habit.suggestions.button': '+ 습관 추천',
    'habit.suggestions.loading': '추천 생성 중...',
    'habit.suggestions.error': '추천 중 오류 발생',
    
    // 네비게이션
    'nav.prev.week': '이전 주',
    'nav.next.week': '다음 주',
    
    // 루틴 관련
    'routine.add': '루틴 추가',
    'routine.start.time': '시작 시간',
    'routine.end.time': '종료 시간',
    'routine.task': '할 일',
    'routine.save': '저장',
    'routine.cancel': '취소',
    'routine.delete': '삭제',
    'routine.edit': '수정',
    
    // 통계 관련
    'stats.weekly.summary': '주간 요약',
    'stats.export.csv': 'CSV 내보내기',
    
    // 일기 관련
    'diary.today.summary': '오늘의 일기',
    'diary.generate.summary': '일기 생성',
    'diary.generate.image': '이미지 생성',
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
    'message.login.success': 'Login successful!',
    'message.admin.login.success': 'Admin login successful!',
    'message.logout.success': 'Logged out successfully.',
    'message.task.completed': 'Completed!',
    'message.habit.added': 'Habit added successfully.',
    'message.error.occurred': 'An error occurred.',
    
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
    
    // Login related
    'login.required': 'Please login to continue.',
    'login.title': 'Please Login',
    'login.id': 'ID',
    'login.password': 'Password',
    'login.button': 'Login',
    'login.error.invalid': 'Invalid user ID or password.',
    'login.error.empty': 'Please enter both ID and password.',
    'login.error.admin': 'Not an admin account.',
    'login.admin.mode': 'Admin Mode',
    'login.normal.mode': 'Switch to Normal Login',
    
    // User registration
    'register.new.user': 'New User',
    'register.new.user.id': 'New User ID',
    'register.new.user.password': 'New User Password',
    'register.error.exists': 'User ID already exists.',
    'register.error.empty': 'Please enter both ID and password.',
    
    // Admin panel
    'admin.panel.title': 'Admin Panel',
    'admin.create.user': 'Create New User',
    'admin.user.list': 'User List',
    'admin.create.user.button': 'Create User',
    'admin.delete.user': 'Delete',
    'admin.loading': 'Loading...',
    'admin.error.create': 'Error creating user.',
    'admin.error.load': 'Error loading user list.',
    'admin.error.delete': 'Error deleting user.',
    'admin.confirm.delete': 'Are you sure you want to delete this user?',
    
    // Habit suggestions
    'habit.suggestions.title': 'Habit Suggestions',
    'habit.suggestions.close': 'Close habit suggestions',
    'habit.suggestions.open': 'Open habit suggestions',
    'habit.suggestions.button': '+ Habit Suggestions',
    'habit.suggestions.loading': 'Generating suggestions...',
    'habit.suggestions.error': 'Error generating suggestions',
    
    // Navigation
    'nav.prev.week': 'Previous Week',
    'nav.next.week': 'Next Week',
    
    // Routine related
    'routine.add': 'Add Routine',
    'routine.start.time': 'Start Time',
    'routine.end.time': 'End Time',
    'routine.task': 'Task',
    'routine.save': 'Save',
    'routine.cancel': 'Cancel',
    'routine.delete': 'Delete',
    'routine.edit': 'Edit',
    
    // Statistics related
    'stats.weekly.summary': 'Weekly Summary',
    'stats.export.csv': 'Export CSV',
    
    // Diary related
    'diary.today.summary': 'Today\'s Diary',
    'diary.generate.summary': 'Generate Summary',
    'diary.generate.image': 'Generate Image',
  }
};

export function getTranslation(language: Language, key: string): string {
  const langTranslations = translations[language];
  return (langTranslations as Record<string, string>)[key] || key;
} 