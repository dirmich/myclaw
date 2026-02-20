---
description: TDD 규칙에 맞는 Git 커밋 생성
---

# TDD Commit - 규칙 준수 커밋

CLAUDE.md의 커밋 규율을 따라 올바른 Git 커밋을 생성합니다.

## 커밋 전 필수 조건

### Commit Discipline (CLAUDE.md)

다음 조건을 **모두** 만족해야 커밋 가능:

1. ✅ **ALL tests are passing**
   ```bash
   bun test
   # 모든 테스트 통과 확인
   ```

2. ✅ **ALL compiler/linter warnings resolved**
   ```bash
   bun run lint
   # 또는
   bun run type-check
   ```

3. ✅ **Single logical unit of work**
   - 하나의 기능 또는 하나의 리팩토링
   - 구조 변경과 동작 변경을 섞지 않음

4. ✅ **Clear commit message**
   - 구조적 변경인지 동작 변경인지 명시
   - Conventional Commits 형식 사용

## Commit Message 형식

### Conventional Commits

```
<type>: <subject>

<body>

<footer>
```

### Type 분류

#### Behavioral Changes (동작 변경)
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `perf`: 성능 개선

#### Structural Changes (구조 변경)
- `refactor`: 코드 리팩토링 (동작 변경 없음)
- `style`: 코드 포맷팅, 세미콜론 등

#### Other
- `test`: 테스트 코드 추가/수정
- `docs`: 문서 수정
- `chore`: 빌드, 설정 파일 수정

### Subject 규칙
- 50자 이내
- 명령문 사용 ("Add" not "Added")
- 첫 글자 소문자
- 마침표 없음

### Body (선택적)
- 무엇을, 왜 했는지 설명
- 어떻게 했는지는 코드가 설명

### Footer (선택적)
- Breaking Changes
- Issue 참조

## 예제

### ✅ Good Examples

#### Behavioral Change (feat)
```bash
git commit -m "feat: add user login with email/password

Implement JWT-based authentication for user login.
Includes email validation and password hashing.

Closes #123"
```

#### Structural Change (refactor)
```bash
git commit -m "refactor: extract validation logic to separate module

Move email and password validation to validators.ts
No behavior changes, tests still pass.

STRUCTURAL CHANGE"
```

#### Bug Fix (fix)
```bash
git commit -m "fix: prevent duplicate user registration

Add unique constraint check before creating user.
Returns 409 Conflict if email already exists.

Fixes #456"
```

#### Test Addition (test)
```bash
git commit -m "test: add integration tests for login endpoint

Cover success case, invalid credentials, and missing fields.
Increases coverage from 75% to 85%."
```

### ❌ Bad Examples

```bash
# Too vague
git commit -m "update code"

# Mixed changes
git commit -m "feat: add login and refactor validators"

# Not descriptive
git commit -m "fix bug"

# Wrong format
git commit -m "Added new feature for users"
```

## 실행 프로세스

### 1. Pre-Commit Checks

```bash
# 1. 모든 테스트 통과 확인
bun test

# 2. Linting 확인
bun run lint

# 3. Type checking
bun run type-check

# 4. 변경 사항 검토
git diff
git status
```

### 2. Commit Type 결정

질문에 답하세요:

**Q: 코드 동작이 변경되었는가?**
- Yes → Behavioral Change
  - 새 기능? → `feat`
  - 버그 수정? → `fix`
  - 성능 개선? → `perf`
- No → Structural Change
  - 리팩토링? → `refactor`
  - 포맷팅? → `style`

**Q: 테스트만 변경?**
- Yes → `test`

**Q: 문서만 변경?**
- Yes → `docs`

### 3. Message 작성

```bash
# Template
git commit -m "<type>: <what you did in 50 chars>

<why you did it and what it affects>

<optional: issue references>"
```

### 4. Commit 실행

```bash
# Stage changes
git add .

# Commit with message
git commit -m "feat: add user authentication

Implement JWT-based login with email/password.
Includes token generation and validation.

Closes #123"
```

## 자동화 흐름

```
Commit Workflow:

1. Tests passing? → bun test
   ↓ All pass
2. Linting clean? → bun run lint
   ↓ No warnings
3. Type check? → bun run type-check
   ↓ Clean
4. Changes review → git diff, git status
   ↓
5. Determine type → feat? fix? refactor?
   ↓
6. Write message → Conventional Commits format
   ↓
7. Commit → git add . && git commit -m "..."
   ↓
8. Success! → Ready for next task
```

## 커밋 전 체크리스트

작업 내용:
- [ ] 단일 논리적 작업 단위인가?
- [ ] 구조 변경과 동작 변경이 분리되어 있는가?

테스트:
- [ ] 모든 테스트가 통과하는가?
- [ ] 새 기능에 대한 테스트를 추가했는가?

코드 품질:
- [ ] Linting 경고가 없는가?
- [ ] Type checking 오류가 없는가?
- [ ] 컴파일 경고가 없는가?

커밋 메시지:
- [ ] Conventional Commits 형식을 따르는가?
- [ ] Type이 정확한가? (feat/fix/refactor)
- [ ] Subject가 50자 이내인가?
- [ ] 명령문을 사용했는가?
- [ ] 무엇을, 왜 했는지 설명했는가?

## 주의사항

### ❌ 절대 커밋하면 안 되는 경우

```bash
# Tests failing
FAIL  src/auth.test.ts
  ✕ should validate email (5 ms)
# → 커밋 금지!

# Linting errors
✖ 3 problems (3 errors, 0 warnings)
# → 수정 후 커밋!

# TypeScript errors
error TS2339: Property 'username' does not exist
# → 수정 후 커밋!
```

### ✅ 커밋해도 되는 경우

```bash
# All tests pass
PASS  src/auth.test.ts
PASS  src/user.test.ts
 PASS  All tests passed (8/8)
# → 커밋 가능!

# No linting issues
✔ No problems found.
# → 커밋 가능!

# Type check clean
✔ Type checking complete. No errors.
# → 커밋 가능!
```

## Commit Frequency

### 자주 커밋하기 (Small, Frequent Commits)

```bash
# Good: 작고 자주
git commit -m "refactor: extract validation"
git commit -m "feat: add email validation"
git commit -m "test: add validation tests"
git commit -m "refactor: improve error messages"

# Bad: 크고 드물게
git commit -m "add entire authentication system"
```

**Benefits**:
- 쉬운 코드 리뷰
- 명확한 히스토리
- 쉬운 롤백
- 빠른 문제 식별

## Agent 활용

- **code-reviewer**: 커밋 전 코드 리뷰
- **testing-expert**: 테스트 커버리지 확인
- **quality-assurance**: 품질 기준 검증

## Best Practices

1. **Commit early, commit often**
   - 작은 단위로 자주 커밋

2. **One commit = One concern**
   - 하나의 커밋은 하나의 관심사만

3. **Separate structural from behavioral**
   - 구조 변경과 동작 변경을 분리

4. **Write meaningful messages**
   - 미래의 자신과 팀을 위한 메시지

5. **Never commit on red**
   - 항상 Green 상태에서 커밋

---

**Good commits = Good project history = Happy team**

```bash
# Pre-commit checklist
bun test && bun run lint && bun run type-check

# If all pass:
git add .
git commit -m "feat: your awesome feature

Detailed explanation of what and why."

# Success! 🎉
```
