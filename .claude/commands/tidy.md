---
description: Tidy First - 구조적 변경만 수행 (동작 변경 없음)
---

# Tidy First - 구조적 정리

Kent Beck의 "Tidy First" 원칙에 따라 **구조적 변경만** 수행합니다.

## 핵심 원칙

> "구조적 변경과 동작 변경을 절대 섞지 마라"

**구조적 변경 (Structural Changes)**:
- 코드 동작은 그대로, 구조만 개선
- 테스트는 변경 전후 동일하게 통과
- 읽기 쉽고 유지보수하기 좋은 코드로 변환

**동작 변경 (Behavioral Changes)**:
- 새로운 기능 추가
- 기존 기능 수정
- 버그 수정

## 구조적 변경 유형

### 1. 네이밍 개선
```typescript
// Before
const d = new Date();
function calc(a, b) { return a + b; }

// After (Tidy)
const currentDate = new Date();
function calculateSum(firstNumber, secondNumber) {
  return firstNumber + secondNumber;
}
```

### 2. 함수 추출 (Extract Function)
```typescript
// Before
function processOrder(order) {
  // 총액 계산
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }

  // 할인 적용
  if (order.coupon) {
    total -= total * order.coupon.discount;
  }

  return total;
}

// After (Tidy)
function processOrder(order) {
  const subtotal = calculateSubtotal(order.items);
  const total = applyDiscount(subtotal, order.coupon);
  return total;
}

function calculateSubtotal(items) {
  return items.reduce((sum, item) =>
    sum + item.price * item.quantity, 0
  );
}

function applyDiscount(amount, coupon) {
  if (!coupon) return amount;
  return amount - (amount * coupon.discount);
}
```

### 3. 상수 추출
```typescript
// Before
if (user.age >= 18) { /* ... */ }
if (timeout > 5000) { /* ... */ }

// After (Tidy)
const ADULT_AGE = 18;
const MAX_TIMEOUT_MS = 5000;

if (user.age >= ADULT_AGE) { /* ... */ }
if (timeout > MAX_TIMEOUT_MS) { /* ... */ }
```

### 4. 중복 코드 제거
```typescript
// Before
function validateEmail(email) {
  if (!email) return false;
  if (!email.includes('@')) return false;
  return true;
}

function validateUsername(username) {
  if (!username) return false;
  if (username.length < 3) return false;
  return true;
}

// After (Tidy)
function validateField(value, validator) {
  if (!value) return false;
  return validator(value);
}

function validateEmail(email) {
  return validateField(email, (e) => e.includes('@'));
}

function validateUsername(username) {
  return validateField(username, (u) => u.length >= 3);
}
```

### 5. 조건문 명확화
```typescript
// Before
if (user && user.isPremium && !user.isSuspended && user.balance > 0) {
  // ...
}

// After (Tidy)
function canAccessPremiumFeatures(user) {
  return user &&
         user.isPremium &&
         !user.isSuspended &&
         user.balance > 0;
}

if (canAccessPremiumFeatures(user)) {
  // ...
}
```

## 실행 프로세스

### 1. 현재 상태 확인
```bash
# 모든 테스트가 통과하는지 확인
bun test
# 또는
npm test
```

**중요**: Green 상태에서만 Tidy 작업 시작!

### 2. 구조적 변경 수행
- 하나의 리팩토링 패턴만 적용
- 작은 단계로 진행
- 코드 동작은 절대 변경하지 않음

### 3. 테스트 실행
```bash
# 각 변경 후 즉시 테스트
bun test
```

**반드시**: 변경 전후 모든 테스트가 동일하게 통과해야 함

### 4. 커밋
```bash
# 구조적 변경 커밋
git add .
git commit -m "refactor: extract calculateSubtotal function"
```

**커밋 메시지**: `refactor:` 또는 `style:` 사용

## 언제 Tidy First를 하는가?

### Tidy First (먼저 정리)
새 기능 추가 **전에** 구조 정리:
```
1. Tidy: 코드 구조 개선 (refactor 커밋)
2. 테스트 통과 확인
3. 새 기능 추가 (feat 커밋)
```

### 예시
새 결제 방법 추가 전:
1. **Tidy**: 기존 결제 코드 리팩토링
2. **테스트**: 기존 기능 여전히 작동 확인
3. **Feature**: 새 결제 방법 추가

## 체크리스트

작업 전:
- [ ] 모든 테스트가 통과하는가? (Green 상태)
- [ ] 구조적 변경과 동작 변경을 분리했는가?

작업 중:
- [ ] 한 번에 하나의 리팩토링만 수행하는가?
- [ ] 각 단계마다 테스트를 실행하는가?
- [ ] 테스트가 변경 전후 동일하게 통과하는가?

작업 후:
- [ ] 코드가 더 읽기 쉬워졌는가?
- [ ] 중복이 제거되었는가?
- [ ] 의도가 명확해졌는가?
- [ ] 별도 커밋으로 분리했는가?

## 자동화 흐름

```
Tidy First Cycle:

1. 현재 Green 확인 → 모든 테스트 통과
2. 구조적 변경 선택 → 하나의 패턴만
3. 변경 수행 → 작은 단계로
4. 테스트 실행 → 여전히 Green?
5. 커밋 → refactor: 메시지
6. 반복 또는 종료
```

## Agent 활용

- **code-refactoring-expert**: 리팩토링 패턴 제안
- **code-reviewer**: 변경 사항 검토
- **testing-expert**: 테스트 통과 확인

## 주의사항

❌ **하지 말아야 할 것**:
- 구조 변경과 동작 변경을 같은 커밋에
- 테스트 없이 리팩토링
- 한 번에 여러 패턴 적용
- Red 상태에서 리팩토링

✅ **해야 할 것**:
- 한 번에 하나씩
- 각 단계마다 테스트
- 별도 커밋으로 분리
- Green 상태 유지

---

**구조를 먼저 정리하면, 기능 추가가 쉬워집니다!**
