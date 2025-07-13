# My Habit App

습관과 루틴을 관리하는 웹 애플리케이션입니다.

## 🚀 주요 기능

- **루틴 관리**: 일일 루틴과 습관을 추가하고 관리
- **진행률 추적**: 완료 상태와 만족도 평가
- **AI 습관 추천**: 인공지능이 개인화된 습관을 추천
- **통계 분석**: 주간 통계와 달성률 시각화
- **AI 일기**: 완료된 활동을 바탕으로 한 AI 생성 일기
- **사용자 관리**: 관리자가 사용자 계정을 생성하고 관리

## 🛠 기술 스택

- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Prisma ORM)
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
- **AI**: OpenAI API

## 📦 설치 및 실행

### 로컬 개발

1. **저장소 클론**
```bash
git clone <repository-url>
cd my-habit-app
```

2. **의존성 설치**
```bash
npm install
```

3. **환경 변수 설정**
```bash
cp .env.example .env.local
```
`.env.local` 파일을 편집하여 필요한 환경 변수를 설정하세요:
```
DATABASE_URL="postgresql://username:password@localhost:5432/habit_app"
OPENAI_API_KEY="your-openai-api-key"
```

4. **데이터베이스 설정**
```bash
npx prisma generate
npx prisma db push
```

5. **개발 서버 실행**
```bash
npm run dev
```

### Vercel 배포

1. **Vercel CLI 설치**
```bash
npm i -g vercel
```

2. **Vercel 프로젝트 연결**
```bash
vercel
```

3. **환경 변수 설정**
Vercel 대시보드에서 다음 환경 변수를 설정하세요:
- `DATABASE_URL`: PostgreSQL 데이터베이스 URL
- `OPENAI_API_KEY`: OpenAI API 키

4. **데이터베이스 마이그레이션**
```bash
vercel env pull .env.local
npx prisma db push
```

## 🗄 데이터베이스 스키마

### Users
- 사용자 계정 정보
- 관리자 권한 관리

### Routines
- 루틴 및 습관 데이터
- 완료 상태 및 만족도
- 사용자별 데이터 분리

### Diaries
- AI 생성 일기 데이터
- 요약 및 이미지 URL

## 🔐 보안

- 사용자별 데이터 분리
- 관리자 권한 검증
- API 엔드포인트 보안

## 📱 사용법

### 일반 사용자
1. 관리자가 제공한 계정으로 로그인
2. 루틴 및 습관 추가
3. 완료 상태 체크 및 만족도 평가
4. 통계 및 일기 확인

### 관리자
1. 관리자 계정으로 로그인
2. 새 사용자 계정 생성
3. 사용자 목록 관리
4. 시스템 모니터링

## 🚀 배포 체크리스트

- [ ] PostgreSQL 데이터베이스 설정
- [ ] 환경 변수 구성
- [ ] Prisma 마이그레이션 실행
- [ ] OpenAI API 키 설정
- [ ] Vercel 프로젝트 연결
- [ ] 도메인 설정 (선택사항)

## 📞 지원

문제가 발생하거나 질문이 있으시면 이슈를 생성해 주세요.
