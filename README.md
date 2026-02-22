# MyClaw (마이클로) 🤖

MyClaw는 원격 서버에 **OpenClaw**를 간편하게 설치하고 관리할 수 있도록 돕는 웹 기반 설치 관리자입니다. SSH를 통해 서버에 접속하여 Docker 기반의 OpenClaw 게이트웨이를 자동으로 구성하고 배포합니다.

## ✨ 주요 기능

- **원격 SSH 설치**: 복잡한 터미널 명령 없이 웹 UI에서 서버 정보만 입력하여 설치 가능
- **Docker 기반 배포**: Docker 및 Docker Compose를 자동으로 구성하여 일관된 실행 환경 보장
- **자동 설정 최적화**: `openclaw.json`을 자동으로 생성하고, 텔레그램 채널 스키마 오류를 방지하는 최적의 설정 적용
- **보안 인증 통합**: 대시보드 접근을 위한 `gatewayToken` 자동 생성 및 인증 플로우 지원
- **실시간 로그 모니터링**: 설치 과정을 실시간으로 확인하고 장애 발생 시 로그 분석 지원

## 🚀 시작하기

### 사전 요구 사항
- 로컬 환경: [Bun](https://bun.sh) 또는 Node.js (v18 이상)
- 원격 서버: SSH 접근이 가능한 Linux 서버 (Ubuntu 추천) 및 Sudo 권한

### 설치 및 실행

1. **저장소 클론**
   ```bash
   git clone https://github.com/dirmich/myclaw.git
   cd myclaw
   ```

2. **의존성 설치**
   ```bash
   bun install
   # 또는 npm install
   ```

3. **개발 서버 실행**
   ```bash
   bun dev
   ```

4. **접속**
   브라우저에서 `http://localhost:3000`에 접속합니다.

## 🛠 사용 방법

1. **서버 정보 입력**: 접속할 원격 서버의 IP, 포트, 사용자 이름, 비밀번호(또는 SSH 키)를 입력합니다.
2. **AI 설정**: 사용할 AI 모델(OpenAI, Anthropic 등)의 API 키를 입력합니다.
3. **텔레그램 설정 (선택)**: 텔레그램 봇 토큰을 입력하면 즉시 통신이 가능하도록 자동 구성됩니다.
4. **설치 시작**: '설치' 버튼을 클릭하면 원격 서버에서 Docker 설치부터 OpenClaw 실행까지 자동으로 진행됩니다.
5. **대시보드 접속**: 설치가 완료되면 제공되는 링크를 통해 OpenClaw 제어 화면으로 즉시 이동할 수 있습니다.

## ☁️ 배포 안내 (GitHub Pages 관련)

> [!WARNING]
> **MyClaw는 GitHub Pages에서 직접 실행할 수 없습니다.**
> 
> GitHub Pages는 **정적(Static)** 파일만 호스팅할 수 있는 서비스입니다. 마이클로는 SSH 연결과 원격 제어를 위해 **Node.js 백엔드(API Routes)**가 필수적으로 필요합니다. 따라서 다음과 같은 플랫폼을 통한 배포를 권장합니다:
> - **Vercel**: Next.js 프로젝트를 가장 쉽게 배포할 수 있는 방법입니다.
> - **Private VPS**: 개인 서버에 Docker 등을 사용하여 직접 호스팅할 수 있습니다.

## 📄 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다.
