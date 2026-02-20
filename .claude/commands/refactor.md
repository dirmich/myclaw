---
description: Refactor - Green 상태에서 코드 품질 개선
---

# Refactor - 코드 개선

TDD의 **Refactor** 단계를 실행합니다. 테스트가 모두 통과한 후에만 수행합니다.

## 핵심 원칙

> "Refactor only when tests are passing (in the Green phase)"

- ✅ 모든 테스트 통과 (Green) → Refactor 가능
- ❌ 테스트 실패 (Red) → Refactor 금지

## Refactoring vs Tidy First

| 구분 | Refactor | Tidy First |
|------|----------|------------|
| **시점** | 테스트 통과 후 (Green) | 기능 추가 전 |
| **목적** | 방금 작성한 코드 개선 | 미래 작업 준비 |
| **범위** | 현재 작업 영역 | 전체 코드베이스 |
| **커밋** | feat와 함께 또는 별도 | 항상 별도 (refactor) |

## Refactoring 우선순위

### 1. 중복 제거 (DRY)
가장 높은 우선순위!

```typescript
// Before
function createUser(name, email) {
  if (!name || !email) throw new Error('Invalid input');
  return { name, email };
}

function createAdmin(name, email) {
  if (!name || !email) throw new Error('Invalid input');
  return { name, email, role: 'admin' };
}

// After (Refactored)
function validateUserInput(name, email) {
  if (!name || !email) {
    throw new Error('Invalid input');
  }
}

function createUser(name, email) {
  validateUserInput(name, email);
  return { name, email };
}

function createAdmin(name, email) {
  validateUserInput(name, email);
  return { name, email, role: 'admin' };
}
```

### 2. 명확성 개선
의도를 드러내는 코드:

```typescript
// Before
function process(data) {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].status === 1 && data[i].amount > 0) {
      result.push(data[i]);
    }
  }
  return result;
}

// After (Refactored)
const OrderStatus = {
  PENDING: 1,
  COMPLETED: 2,
  CANCELLED: 3,
} as const;

function isValidOrder(order) {
  return order.status === OrderStatus.PENDING &&
         order.amount > 0;
}

function filterValidOrders(orders) {
  return orders.filter(isValidOrder);
}
```

### 3. 단일 책임 원칙
함수는 한 가지 일만:

```typescript
// Before
function saveUser(user) {
  // 검증
  if (!user.email.includes('@')) {
    throw new Error('Invalid email');
  }

  // 변환
  user.email = user.email.toLowerCase();

  // 저장
  database.insert('users', user);

  // 이메일 전송
  sendWelcomeEmail(user.email);
}

// After (Refactored)
function validateUser(user) {
  if (!user.email.includes('@')) {
    throw new Error('Invalid email');
  }
}

function normalizeUser(user) {
  return {
    ...user,
    email: user.email.toLowerCase(),
  };
}

function saveUser(user) {
  validateUser(user);
  const normalizedUser = normalizeUser(user);
  database.insert('users', normalizedUser);
  sendWelcomeEmail(normalizedUser.email);
}
```

## Refactoring 패턴

### Extract Function (함수 추출)
복잡한 로직을 작은 함수로 분리

### Extract Variable (변수 추출)
복잡한 표현식을 의미있는 변수로

### Inline Function/Variable (인라인)
너무 작거나 명확한 것은 인라인

### Rename (이름 변경)
의도를 드러내는 이름으로

### Move Function (함수 이동)
관련 있는 함수들끼리 묶기

## 실행 프로세스

### 1. Green 상태 확인
```bash
# 모든 테스트 통과 확인
bun test
```

❌ 실패하는 테스트가 있으면 Refactor 금지!

### 2. 개선 영역 식별
다음을 찾으세요:
- 중복 코드
- 긴 함수 (>20줄)
- 복잡한 조건문
- 불명확한 이름
- 여러 책임을 가진 함수

### 3. 한 번에 하나씩 개선
```
한 가지 리팩토링 선택 → 적용 → 테스트 → 커밋
```

### 4. 각 단계마다 테스트
```bash
# 리팩토링 하나 완료 후
bun test

# 여전히 Green?
# Yes → 다음 리팩토링
# No → 변경 롤백
```

### 5. 커밋
```bash
git add .
git commit -m "refactor: extract validation logic"
```

## 자동화 흐름

```
Refactor Cycle:

1. Green 확인 → 모든 테스트 통과?
   ↓ Yes
2. 개선 영역 선택 → 중복? 복잡도? 명확성?
   ↓
3. 패턴 적용 → Extract? Rename? Move?
   ↓
4. 테스트 실행 → 여전히 Green?
   ↓ Yes
5. 커밋 → refactor: 메시지
   ↓
6. 더 개선? → Yes면 2번으로, No면 종료
```

## 언제 멈춰야 하는가?

### 멈춰야 할 때
- 테스트가 실패하기 시작
- 더 이상 명확한 개선점이 없음
- 코드가 충분히 간단하고 명확함
- 시간이 너무 오래 걸림 (나중에 할 것)

### 계속해야 할 때
- 명백한 중복이 존재
- 함수가 너무 김 (>50줄)
- 의도가 불명확함
- 여러 책임이 섞여 있음

## 품질 기준

### Code Quality Standards (rule.md 참고)

- **중복 제거**: DRY 원칙
- **명확한 의도**: 이름과 구조로 표현
- **명시적 의존성**: 숨겨진 의존성 제거
- **작고 집중된 함수**: 한 가지 일만
- **최소 부작용**: 순수 함수 선호
- **단순한 해결책**: KISS 원칙

## Agent 활용

- **code-refactoring-expert**: 리팩토링 패턴 제안 및 적용
- **code-reviewer**: 개선 사항 검토
- **performance-engineer**: 성능 최적화
- **testing-expert**: 테스트 커버리지 확인

## 체크리스트

작업 전:
- [ ] 모든 테스트가 통과하는가? (Green)
- [ ] 개선할 명확한 이유가 있는가?

작업 중:
- [ ] 한 번에 하나의 패턴만 적용하는가?
- [ ] 각 단계마다 테스트하는가?
- [ ] 테스트가 여전히 통과하는가?

작업 후:
- [ ] 코드가 더 읽기 쉬워졌는가?
- [ ] 중복이 제거되었는가?
- [ ] 함수가 한 가지 일만 하는가?
- [ ] 테스트가 모두 통과하는가?

## 예제

### Before (Green but needs refactor):
```typescript
function processOrder(order) {
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }

  if (order.coupon) {
    total = total - (total * order.coupon.discount);
  }

  if (total > 100) {
    total = total - 10;
  }

  return total;
}
```

### After (Refactored):
```typescript
const FREE_SHIPPING_THRESHOLD = 100;
const FREE_SHIPPING_DISCOUNT = 10;

function calculateSubtotal(items) {
  return items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
}

function applyCouponDiscount(amount, coupon) {
  if (!coupon) return amount;
  return amount - (amount * coupon.discount);
}

function applyFreeShipping(amount) {
  if (amount > FREE_SHIPPING_THRESHOLD) {
    return amount - FREE_SHIPPING_DISCOUNT;
  }
  return amount;
}

function processOrder(order) {
  const subtotal = calculateSubtotal(order.items);
  const afterCoupon = applyCouponDiscount(subtotal, order.coupon);
  const final = applyFreeShipping(afterCoupon);
  return final;
}
```

## 주의사항

❌ **하지 말 것**:
- Red 상태에서 리팩토링
- 테스트 없이 리팩토링
- 동작 변경과 리팩토링을 섞음
- 한 번에 여러 패턴 적용

✅ **해야 할 것**:
- Green 상태에서만
- 각 단계마다 테스트
- 작은 단계로 진행
- 명확한 개선 이유

---

**Clean code is not written by following rules. Clean code is written by refactoring.**
