# 프로젝트 개발 규칙

## 런타임 및 패키지 관리

### Bun 사용
- **패키지 관리**: `bun install`, `bun add`, `bun remove` 사용
- **스크립트 실행**: `bun run <script>` 사용
- **테스트 실행**: `bun test` 사용
- **개발 서버**: `bun dev` 사용
- npm, yarn, pnpm 대신 Bun 사용 권장

## 코딩 컨벤션

### 네이밍 규칙
- 변수명: camelCase 사용
- 함수명: camelCase 사용, 동사로 시작
- 컴포넌트명: PascalCase 사용
- 상수: UPPER_SNAKE_CASE 사용
- 파일명: kebab-case 사용

### 코드 스타일
- 들여쓰기: 2 spaces
- 세미콜론: 사용
- 따옴표: single quotes 우선
- 최대 줄 길이: 100자
- 함수 최대 길이: 50줄

## 폴더 구조

```
src/
├── app/              # Next.js App Router (pages)
├── components/       # 재사용 가능한 컴포넌트
│   ├── ui/          # shadcn/ui 컴포넌트
│   └── features/    # 기능별 컴포넌트
├── hooks/           # Custom hooks
├── lib/             # 유틸리티 함수 및 설정
├── types/           # TypeScript 타입 정의
└── styles/          # 전역 스타일 (Tailwind 설정)
```

## UI/스타일링

### Tailwind CSS
- Utility-first CSS 프레임워크 사용
- 커스텀 테마는 `tailwind.config.ts`에 정의
- 반응형: `sm:`, `md:`, `lg:`, `xl:`, `2xl:` 활용

### shadcn/ui
- 재사용 가능한 UI 컴포넌트 라이브러리
- `bunx shadcn-ui@latest add <component>` 로 컴포넌트 추가
- `components/ui/` 폴더에서 관리
- 커스터마이징 가능한 컴포넌트

## 테스트 규칙

- 모든 기능에 대한 단위 테스트 작성
- 테스트 커버리지 최소 80% 유지
- E2E 테스트는 주요 사용자 플로우에 대해 작성
- 테스트 파일명: `*.test.ts` 또는 `*.spec.ts`
- 테스트 실행: `bun test`

## Git 컨벤션

### 커밋 메시지
```
<type>: <subject>

<body>

<footer>
```

**Types:**
- feat: 새로운 기능
- fix: 버그 수정
- docs: 문서 수정
- style: 코드 포맷팅, 세미콜론 누락 등
- refactor: 코드 리팩토링
- test: 테스트 코드
- chore: 빌드 업무, 패키지 매니저 설정 등

### 브랜치 전략
- main: 프로덕션 브랜치
- develop: 개발 브랜치
- feature/*: 기능 개발 브랜치
- hotfix/*: 긴급 수정 브랜치

## 보안 규칙

- 환경변수는 `.env.local` 파일에 저장 (절대 커밋 금지)
- API 키, 비밀번호 등 민감한 정보 하드코딩 금지
- 사용자 입력은 항상 검증 및 sanitize
- XSS, CSRF 공격 방어 고려

## 성능 최적화

- Next.js Image 컴포넌트 사용 (자동 최적화)
- 코드 스플리팅 활용 (dynamic import)
- 불필요한 re-render 방지 (React.memo, useMemo, useCallback)
- Tailwind CSS의 PurgeCSS 활용

## 접근성 (a11y)

- 시맨틱 HTML 사용
- ARIA 속성 적절히 활용
- 키보드 네비게이션 지원
- 색상 대비 WCAG 기준 준수
- shadcn/ui 컴포넌트는 기본 접근성 제공

## 문서화

- README.md 최신 상태 유지
- 복잡한 로직에 주석 추가
- API 문서 작성 및 유지보수
- 변경사항은 CHANGELOG.md에 기록

---

**참고:** 이 규칙은 프로젝트 특성에 맞게 수정하여 사용하세요.
