---
description: 프로젝트 요구사항 기반 구현 시작 (Bun + Tailwind + shadcn/ui)
---

# 프로젝트 구현 시작

당신은 시니어 풀스택 개발자이자 아키텍트입니다. Bun, Tailwind CSS, shadcn/ui를 활용하여 프로젝트를 구현하세요.

## 1단계: 요구사항 분석

need.md 파일을 읽고 다음을 분석하세요:
- 프로젝트 목적과 핵심 가치
- 주요 기능 목록 및 우선순위
- 기술 스택 및 아키텍처 요구사항 (Bun, Tailwind, shadcn/ui 기본)
- 비기능적 요구사항 (성능, 보안, 확장성)

## 2단계: 개발 규칙 확인

.claude/rule.md 파일을 읽고 다음을 숙지하세요:
- Bun 사용 규칙
- 코딩 컨벤션 및 네이밍 규칙
- 폴더 구조 (App Router + shadcn/ui)
- Git 커밋 컨벤션
- 테스트 및 문서화 요구사항

## 3단계: 프로젝트 계획 수립

plan.md 파일을 생성하고 다음을 포함하세요:

```markdown
# 구현 계획

## 아키텍처 설계

### 기술 스택
**Frontend**:
- Runtime: Bun
- Framework: Next.js 14+ (App Router)
- Language: TypeScript
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- State: Zustand / React Context
- Forms: React Hook Form + Zod

**Backend**:
- API: Next.js API Routes / Server Actions
- Database: Supabase (PostgreSQL)
- ORM: Prisma
- Auth: NextAuth.js / Supabase Auth

**DevOps**:
- Hosting: Vercel
- CI/CD: GitHub Actions
- Testing: Vitest + Playwright

### 폴더 구조
```
src/
├── app/              # Next.js App Router
│   ├── (auth)/      # 인증 관련 라우트 그룹
│   ├── (dashboard)/ # 대시보드 라우트 그룹
│   └── api/         # API routes
├── components/
│   ├── ui/          # shadcn/ui components
│   └── features/    # Feature components
├── lib/             # Utilities & config
├── hooks/           # Custom hooks
├── types/           # TypeScript types
└── styles/          # Global styles
```

## 데이터 모델
[Prisma schema 정의]

## API 설계
[RESTful API 엔드포인트]

## 구현 순서

### Phase 1: 프로젝트 초기화
- [ ] Bun + Next.js 14 프로젝트 생성
  ```bash
  bun create next-app@latest . --typescript --tailwind --app
  ```
- [ ] shadcn/ui 설치 및 설정
  ```bash
  bunx shadcn-ui@latest init
  ```
- [ ] 기본 UI 컴포넌트 추가
  ```bash
  bunx shadcn-ui@latest add button input card form
  ```
- [ ] ESLint + Prettier 설정
- [ ] Vitest 설정
- [ ] 환경 변수 설정

### Phase 2: 인증 시스템
[인증 관련 작업 항목]

### Phase 3: 핵심 기능
[need.md 기반 기능 구현]

### Phase 4: UI/UX (shadcn/ui)
- [ ] shadcn/ui 테마 커스터마이징
- [ ] 공통 레이아웃 컴포넌트
- [ ] 반응형 디자인 구현
- [ ] 다크 모드 지원

### Phase 5: 테스트 및 최적화
- [ ] Vitest 단위 테스트
- [ ] Playwright E2E 테스트
- [ ] Lighthouse 성능 최적화
- [ ] 보안 검토
```

## 4단계: TDD 기반 구현

CLAUDE.md의 TDD 원칙을 따라 개발하세요:

1. **Red**: 실패하는 테스트 작성 (`bun test`)
2. **Green**: 테스트를 통과하는 최소한의 코드 구현
3. **Refactor**: 코드 품질 개선

## 5단계: Agent 및 Skills 활용

### 적절한 Agent 호출:
- **nextjs-expert**: Next.js 14 App Router 구현
- **frontend-developer**: shadcn/ui 컴포넌트
- **typescript-pro**: 타입 안전성
- **testing-expert**: Vitest + Playwright
- **code-reviewer**: 코드 리뷰
- **performance-engineer**: 최적화

### Skills 활용:
- **senior-fullstack**: 전체 아키텍처
- **senior-frontend**: Tailwind + shadcn/ui
- **senior-backend**: Next.js API
- **senior-qa**: 테스트 전략

## 6단계: 진행 상황 관리

TodoWrite를 사용하여 진행 상황을 추적하세요.

## 실행 프로세스

"go" 명령이 있을 때까지 계획만 수립하고 대기하세요.
"go" 명령 시:
1. plan.md에서 다음 미완료 항목 찾기
2. 테스트 작성 (Red)
3. 최소 구현 (Green)
4. 리팩토링 (Refactor)
5. 커밋 (`bun run lint && bun test && git commit`)

## 주의사항

- Bun 명령어 사용: `bun install`, `bun dev`, `bun test`
- shadcn/ui 컴포넌트는 필요할 때마다 추가
- Tailwind utility-first 접근 방식 활용
- 테스트 없이 코드 작성 금지
- rule.md의 모든 규칙 준수

---

이제 need.md와 rule.md를 분석하고 plan.md를 생성하세요.
