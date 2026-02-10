# 배포 프로세스 (Git → Vercel 재배포)

코드를 수정한 뒤 다시 배포할 때 따르면 되는 순서입니다.

---

## 1단계: 로컬에서 Git 커밋 및 푸시

프로젝트 폴더(petpresso)에서 터미널을 열고 아래를 순서대로 실행합니다.

```bash
# 변경된 파일 확인
git status

# 모든 변경 사항 스테이징
git add .

# 커밋 (메시지는 수정 내용에 맞게 변경 가능)
git commit -m "페이지 하단에 사전 예약 30% 할인 버튼 추가"

# GitHub로 푸시 (master 브랜치 사용 시)
git push origin master
```

- `main` 브랜치를 쓰는 경우: `git push origin main`

---

## 2단계: Vercel 자동 배포 확인

1. **Vercel** (https://vercel.com) 로그인 후 **petpresso** 프로젝트 클릭.
2. **Deployments** 탭으로 이동.
3. 방금 푸시한 커밋으로 **새 배포가 자동으로 시작**되었는지 확인.
4. 상태가 **Building** → **Ready** 로 바뀔 때까지 대기 (보통 1~2분).

---

## 3단계: (자동 배포가 안 될 때) 수동 재배포

- 새 배포가 자동으로 안 뜨면:
  1. **Deployments** 탭에서 맨 위 배포 오른쪽 **⋮** (세 점) 클릭.
  2. **Redeploy** 선택 후 확인.
  3. **Ready** 될 때까지 대기.

---

## 4단계: 배포 결과 확인

1. **Visit** 버튼 클릭 또는 배포된 도메인(예: `petpresso-orcin.vercel.app`) 접속.
2. 메인 페이지 하단에 **「사전 예약하고 30% 할인받기」** 버튼이 보이는지 확인.

---

## 요약

| 순서 | 작업 |
|------|------|
| 1 | `git add .` → `git commit -m "..."` → `git push origin master` |
| 2 | Vercel **Deployments**에서 자동 배포 확인 |
| 3 | 안 되면 **Redeploy** 한 번 실행 |
| 4 | **Visit**으로 화면 확인 |

이 순서대로 진행하면 변경 사항이 다시 배포됩니다.
