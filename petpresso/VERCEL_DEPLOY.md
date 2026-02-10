# Vercel 배포 전 체크 (package.json 없음 에러 해결)

## 1. 터미널에서 프로젝트 폴더로 이동

```bash
cd "C:\Users\khkim\OneDrive\문서\cursor\petpresso"
```

(또는 petpresso 폴더가 있는 실제 경로)

## 2. Git 상태 확인

```bash
git status
```

- `package.json`이 "Untracked" 또는 "Changes not staged"로 나오면 → 3단계로
- 이미 "nothing to commit"이면 → GitHub 웹에서 저장소를 열어 루트에 package.json이 보이는지 확인

## 3. 모든 파일 추가 후 푸시

```bash
git add .
git status
git commit -m "Add package.json and all project files for Vercel"
git push origin master
```

## 4. GitHub에서 확인

- https://github.com/khkimjh01-ctrl/petpresso 접속
- **저장소 루트**에 `package.json`, `package-lock.json`, `src`, `index.html`, `vite.config.js` 등이 보여야 함

## 5. Vercel에서 재배포

- Vercel → petpresso 프로젝트 → **Deployments** → **Redeploy**
- 또는 새로 푸시했으면 자동으로 다시 배포됨

## 6. Vercel 설정 확인

- **Settings** → **General** → **Root Directory**: **비워 두기**
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
