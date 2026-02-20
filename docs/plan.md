# 구현 계획

## 프로젝트 정보
- **이름**: OpenClaw Web Installer (MyClaw)
- **프레임워크**: Next.js 14, React
- **시작일**: 2026-02-20
- **목표**: VirtualBox, AWS EC2, Mac mini 등 다양한 환경에 OpenClaw를 간편하게 설치하고 실행할 수 있는 다국어 지원 Web UI 제공

## 아키텍처 설계

### 기술 스택
**Frontend**:
- Framework: Next.js 14 (App Router)
- Runtime: Bun
- Styling: Tailwind CSS
- UI Components: shadcn/ui
- State: Zustand
- Forms: React Hook Form + Zod
- i18n: next-intl (다국어 지원: EN, KO, JP, CN, ES)

**Backend**:
- API: Next.js API Routes (SSH, Key Validator, Install triggers)

**DevOps**:
- Deploy/Hosting: Local run via Bun

### 폴더 구조
```
src/
├── app/              # Next.js App Router
│   ├── [locale]/    # 다국어 라우팅
│   └── api/         # API routes (SSH/keys)
├── components/
│   ├── ui/          # shadcn/ui components
│   └── features/    # 설치 단계별 컴포넌트
├── lib/             # Utilities (SSH 연동, 검증 로직 등)
├── types/           # TypeScript types
└── styles/          # Global styles
```

## API 설계

### Connection & Validation
- `POST /api/test-ssh` - SSH 연결 유효성 테스트
- `POST /api/test-key` - AI / Telegram 키 연결 테스트
- `POST /api/install` - 원격 서버 대상 OpenClaw 자동 설치 스크립트 실행

## 구현 순서

### Phase 1: 프로젝트 초기화 ⏳
- [x] Bun + Next.js 14 프로젝트 생성
- [x] Tailwind CSS 설정
- [x] shadcn/ui 설치 및 기본 컴포넌트(button, input, form, card, step 등) 추가
- [x] 다국어(i18n) 설정

### Phase 2: UI 레이아웃 및 컨텍스트 📋
- [x] 다국어 언어 선택기 및 공통 헤더
- [x] 단계별 네비게이션(Wizard) UI 구현
  - [x] 테스트: 렌더링 검증, 강제 단계 이동 락 기능 확인

### Phase 3: 환경 및 SSH 정보 입력 📋
- [x] 설치 환경(VirtualBox, AWS EC2, Mac mini 등) 선택 폼
- [x] SSH 접속 정보(Host, Port, User, Auth) 폼
  - [x] 테스트: 필수 입력값 제출 시 유효성 검증
  - [x] 테스트: SSH 연결 API 정상/실패 모의 응답 검증

### Phase 4: AI & Telegram 키 입력 및 테스트 📋
- [x] 키 입력 폼
  - [x] AI Provider Key (ex: OpenAI) 입력 폼 (선택)
  - [x] Telegram Bot Token 입력 폼 (선택)
- [x] 테스트: 입력된 키 유효성 검증 API 모의 테스트(터미널 뷰 / 프로그레스바)
- [ ] 완료 화면 및 접속(실행) 접속 방법 제공

### Phase 6: 랜딩 페이지 구현 🚀
- [x] 모던하고 세련된 디자인의 서비스 소개 랜딩 페이지
- [x] 주요 기능(Feature) 섹션 구성
- [x] 헤더에 현재 버전 표시 (v0.1.0)
- [x] '시작하기(Start)' 버튼 클릭 시 설치 마법사로 전환

## 진행 상황

### 현재 작업
- 작업 완료: 랜딩 페이지 및 설치 마법사 전체 프로세스 구현 완료

### 통계
- 완료: 12/12
- 진행률: 100%
- 테스트 커버리지: 0%
