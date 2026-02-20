---
description: plan.md 생성 및 업데이트 관리
---

# Plan Management - 계획 수립 및 관리

need.md를 기반으로 plan.md를 생성하고 진행 상황을 관리합니다.

## plan.md 역할

**TDD 개발의 로드맵**:
- 무엇을 테스트할 것인가
- 어떤 순서로 구현할 것인가
- 현재 진행 상황은 어떠한가

## plan.md 구조

```markdown
# 구현 계획

## 프로젝트 정보
- **이름**: [프로젝트 이름]
- **프레임워크**: [Next.js, React 등]
- **시작일**: [YYYY-MM-DD]
- **목표**: [핵심 가치 제안]

## 아키텍처 설계

### 기술 스택
**Frontend**:
- Framework: Next.js 14 (App Router)
- Runtime: Bun
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- State: Zustand
- Forms: React Hook Form + Zod

**Backend**:
- API: Next.js API Routes
- Database: Supabase (PostgreSQL)
- ORM: Prisma
- Auth: Supabase Auth

**DevOps**:
- Hosting: Vercel
- CI/CD: GitHub Actions
- Testing: Vitest + Playwright

### 폴더 구조
```
src/
├── app/              # Next.js App Router
├── components/       # React components
│   ├── ui/          # shadcn/ui components
│   └── features/    # Feature components
├── lib/             # Utilities
├── hooks/           # Custom hooks
├── types/           # TypeScript types
└── tests/           # Test files
```

## 데이터 모델

### User
```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String
  createdAt DateTime @default(now())
  posts     Post[]
}
```

### [Other Models]
...

## API 설계

### Authentication
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인
- `POST /api/auth/logout` - 로그아웃

### [Other Endpoints]
...

## 구현 순서

### Phase 1: 프로젝트 초기화 ⏳
- [x] Bun + Next.js 14 프로젝트 생성
- [x] Tailwind CSS 설정
- [x] shadcn/ui 설치 및 설정
- [ ] ESLint + Prettier 설정
- [ ] Vitest 설정
- [ ] Playwright 설정

### Phase 2: 인증 시스템 📋
#### 2.1 Supabase 설정
- [ ] Supabase 프로젝트 생성
- [ ] 환경 변수 설정
- [ ] Supabase 클라이언트 설정

#### 2.2 회원가입
- [ ] 이메일 형식 검증
  - [ ] 테스트: 유효한 이메일 통과
  - [ ] 테스트: 잘못된 형식 거부
- [ ] 비밀번호 강도 검증
  - [ ] 테스트: 최소 8자 이상
  - [ ] 테스트: 특수문자 포함
- [ ] 중복 이메일 확인
  - [ ] 테스트: 중복 시 409 에러
  - [ ] 테스트: 새 이메일 성공

#### 2.3 로그인
- [ ] 이메일/비밀번호 검증
  - [ ] 테스트: 유효한 자격증명 성공
  - [ ] 테스트: 잘못된 비밀번호 실패
  - [ ] 테스트: 존재하지 않는 이메일 실패
- [ ] JWT 토큰 생성
  - [ ] 테스트: 토큰 생성 성공
  - [ ] 테스트: 토큰 검증 성공

### Phase 3: 핵심 기능 📋
[need.md의 우선순위에 따라 기능별로 작성]

#### 3.1 [기능 이름]
- [ ] [세부 테스트 항목 1]
  - [ ] 테스트: [시나리오 1]
  - [ ] 테스트: [시나리오 2]
- [ ] [세부 테스트 항목 2]
  ...

### Phase 4: UI/UX 구현 📋
- [ ] shadcn/ui 컴포넌트 구성
  - [ ] Button, Input, Card 설정
  - [ ] Form 컴포넌트 구성
- [ ] 레이아웃 구현
  - [ ] 헤더 컴포넌트
  - [ ] 네비게이션
  - [ ] 푸터
- [ ] 페이지 구현
  - [ ] 홈 페이지
  - [ ] 로그인/회원가입 페이지
  - [ ] [기타 주요 페이지]

### Phase 5: 테스트 & 최적화 📋
- [ ] 단위 테스트 (목표: 80%+ 커버리지)
  - [ ] 유틸리티 함수
  - [ ] 컴포넌트
  - [ ] API 핸들러
- [ ] E2E 테스트
  - [ ] 사용자 회원가입/로그인 플로우
  - [ ] 핵심 기능 사용자 시나리오
- [ ] 성능 최적화
  - [ ] 이미지 최적화
  - [ ] 코드 스플리팅
  - [ ] 캐싱 전략
- [ ] 보안 검토
  - [ ] XSS 방어
  - [ ] CSRF 방어
  - [ ] SQL Injection 방어

## 진행 상황

### 현재 작업
- 작업 중: [현재 Phase와 항목]
- 다음 작업: [다음 항목]

### 통계
- 완료: [X/총 항목수]
- 진행률: [XX%]
- 테스트 커버리지: [XX%]

## 참고 사항
- [특이사항이나 중요한 결정 사항]
```

## 생성 프로세스

### 1. need.md 분석
```
당신은 시니어 아키텍트입니다. need.md를 읽고 분석하세요:

1. **핵심 가치 파악**
   - 프로젝트의 본질적 목적
   - 주요 사용자 니즈

2. **기능 우선순위**
   - 높음: MVP에 필수
   - 중간: 2차 릴리즈
   - 낮음: 향후 고려

3. **기술적 제약사항**
   - 성능 요구사항
   - 보안 요구사항
   - 확장성 요구사항

4. **의존성 파악**
   - 어떤 기능이 먼저 필요한가
   - 기능 간 의존 관계는?
```

### 2. 아키텍처 설계
```
시스템 아키텍처를 설계하세요:

1. **기술 스택 결정**
   - Frontend: Next.js 14 + Bun + Tailwind + shadcn/ui
   - Backend: Next.js API + Supabase + Prisma
   - DevOps: Vercel + GitHub Actions

2. **데이터 모델**
   - Entity 정의
   - 관계 설정
   - Prisma Schema 작성

3. **API 설계**
   - RESTful endpoints
   - Request/Response 형식
   - Error handling

4. **폴더 구조**
   - Next.js App Router 기반
   - Feature-based organization
```

### 3. 테스트 계획 수립
```
각 기능을 작은 테스트로 분해:

1. **Happy Path (정상 경로)**
   - [ ] 테스트: 성공 시나리오

2. **Edge Cases (경계 사례)**
   - [ ] 테스트: 빈 입력
   - [ ] 테스트: 최대값
   - [ ] 테스트: 최소값

3. **Error Cases (오류 사례)**
   - [ ] 테스트: 잘못된 입력
   - [ ] 테스트: 권한 없음
   - [ ] 테스트: 리소스 없음
```

### 4. 순서 결정
```
의존성을 고려한 구현 순서:

1. **Foundation** (기반)
   - 프로젝트 설정
   - 기본 구조
   - 개발 환경

2. **Authentication** (인증)
   - 사용자 관리
   - 권한 시스템

3. **Core Features** (핵심 기능)
   - 우선순위 높은 것부터
   - 의존성 순서대로

4. **UI/UX** (사용자 경험)
   - 컴포넌트 구성
   - 페이지 구현

5. **Polish** (완성도)
   - 테스트
   - 최적화
   - 배포
```

## 업데이트 프로세스

### 항목 완료 시
```markdown
# Before
- [ ] 이메일 형식 검증

# After (/go 실행 후 완료)
- [x] 이메일 형식 검증
```

### 새 항목 추가 시
```markdown
### Phase 3: 핵심 기능
...
#### 3.3 [새 기능] ✨ NEW
- [ ] [테스트 항목 1]
- [ ] [테스트 항목 2]
```

### 진행 상황 업데이트
```markdown
## 진행 상황

### 현재 작업
- 작업 중: Phase 2.2 회원가입 - 이메일 검증
- 다음 작업: Phase 2.2 회원가입 - 비밀번호 강도 검증

### 통계
- 완료: 15/87
- 진행률: 17%
- 테스트 커버리지: 82%
```

## Agent 활용

- **senior-architect**: 아키텍처 설계
- **senior-fullstack**: 전체 구조 및 순서
- **testing-expert**: 테스트 시나리오 수립
- **nextjs-expert**: Next.js 관련 구조

## 자동화 흐름

```
Plan Creation:

1. Read need.md → 요구사항 분석
   ↓
2. Design Architecture → 기술 스택 + 구조
   ↓
3. Model Data → Prisma schema
   ↓
4. Design APIs → Endpoints
   ↓
5. Break into Tests → 작은 단위로
   ↓
6. Order by Dependency → 의존성 순서
   ↓
7. Write plan.md → 완성!
   ↓
8. Ready for /go → 구현 시작
```

## 체크리스트

plan.md 작성 완료 시:

- [ ] 모든 need.md 요구사항이 포함되었는가?
- [ ] 기능이 작은 테스트로 분해되었는가?
- [ ] 의존성 순서가 올바른가?
- [ ] 기술 스택이 명시되었는가? (Bun, Tailwind, shadcn/ui)
- [ ] 데이터 모델이 정의되었는가?
- [ ] API 엔드포인트가 설계되었는가?
- [ ] 테스트 전략이 수립되었는가?
- [ ] Phase가 논리적으로 나뉘었는가?

## 예제 plan.md 항목

### Good ✅
```markdown
#### 2.2 회원가입
- [ ] 이메일 형식 검증
  - [ ] 테스트: "user@example.com" 형식 통과
  - [ ] 테스트: "invalid-email" 형식 거부
  - [ ] 테스트: 빈 문자열 거부
```

**이유**: 구체적이고 테스트 가능

### Bad ❌
```markdown
- [ ] 회원가입 기능 만들기
```

**이유**: 너무 크고 모호함

---

**Good plan = Successful project**

```
need.md → 분석 → 설계 → plan.md → /go → 구현!
```
