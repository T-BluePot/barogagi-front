# 배포 워크플로 npm → pnpm 전환 (해야 할 일)

- 작성: 2026-07-18 / 상태: **미착수** — 공유 링크 PR 머지 후 **별도 브랜치**에서 진행
- 대상 파일: `.github/workflows/deploy.yml`

---

## 문제

레포는 **pnpm**을 쓰는데(`pnpm-lock.yaml` 존재, `package-lock.json` 없음), 배포 워크플로는 **npm**으로 빌드한다.

```yaml
# .github/workflows/deploy.yml (현재)
- uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'          # ← pnpm 아님
- run: |
    npm install           # ← pnpm-lock.yaml 을 못 읽음
    npm run build
```

`npm install`은 자기 형식(`package-lock.json`)만 읽는다. 그게 없으니 **lockfile 없이** `package.json`의 버전 범위만 보고 그때그때 최신을 설치한다.

```json
"framer-motion": "^12.23.22"   // "12.23.22 이상 13 미만이면 아무 버전"
```

### 실제로 생기는 일
- 배포할 때마다 그 시점 최신 버전이 깔림 (오늘 `12.40.0`, 다음 주 `12.45.0` — 코드 변경 없이)
- **로컬(pnpm-lock 고정)과 배포(npm 자유 해석)가 서로 다른 버전**으로 빌드됨
- 어떤 의존성이 새 버전에서 회귀를 내면 **코드 한 줄 안 바꿨는데 배포가 깨짐**
- 깨져도 **로컬에서 재현 안 됨** (로컬은 lockfile대로 깔리니까)

> 참고: 이 프로젝트는 실제로 `react-modal-sheet` × 특정 motion 버전 조합에서 모달이 안 열린 이력이 있다(#101).
> lockfile을 무시하는 배포는 이런 버전 민감 이슈에 특히 취약하다.

---

## 고치는 방법

```yaml
# .github/workflows/deploy.yml (변경안)
      - name: Setup pnpm
        uses: pnpm/action-setup@v4
        with:
          version: 10.32.1       # 로컬과 정확히 동일하게 고정 (pnpm --version으로 확인)

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'          # 'npm' → 'pnpm'

      # ... (env 파일 생성 스텝은 그대로) ...

      - name: Build Frontend
        run: |
          pnpm install --frozen-lockfile   # lockfile과 다르면 설치 실패(= 재현 보장)
          pnpm build
```

### 체크리스트
- [ ] `pnpm/action-setup@v4` 스텝 추가 (`actions/setup-node` **앞**에 와야 `cache: 'pnpm'`이 동작)
- [ ] `cache: 'npm'` → `cache: 'pnpm'`
- [ ] `npm install` → `pnpm install --frozen-lockfile`
- [ ] `npm run build` → `pnpm build`
- [ ] `.env` 생성 스텝은 수정 불필요 (그대로)
- [ ] (선택) `package.json`에 `"packageManager": "pnpm@10.32.1"` 명시 — Corepack 사용 시 pnpm 버전까지 강제

---

## ⚠️ 왜 공유 링크 PR과 분리하나 / 머지 후에 하나

- 이 워크플로는 **`main` / `release`에 push될 때만** 실행된다 → **머지 전엔 실전 테스트가 불가능**하다.
- 잘못 건드리면 **배포 자체가 안 되는 상태로 머지**될 수 있다. 공유 기능과 섞으면 원인 분리도 어려워진다.
- 그래서 **공유 PR을 먼저 머지**하고, **배포만 단독으로 다루는 새 브랜치**에서 진행한다.

### 검증 방법 (머지 없이 확인 가능한 것)
- 로컬에서 `pnpm install --frozen-lockfile && pnpm build`가 성공하는지 (이미 됨)
- 워크플로 문법: `act`(로컬 GitHub Actions 러너)로 dry-run하거나, **먼저 `main`에 반영해 테스트 서버로만 한 번 돌려보고** 문제없으면 `release`로.

---

## 진행 로그
- ⬜ 공유 링크 PR(`feat/schedule-share-link`) 머지 대기
- ⬜ 머지 후 새 브랜치(예: `chore/ci-pnpm`)에서 위 변경 적용
- ⬜ `main`(테스트 서버) 배포로 먼저 검증 → 정상 시 `release`
