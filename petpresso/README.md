# Petpresso Premium feeder

Petpresso 프리미엄 급식기 앱의 웹 대시보드입니다.

## 기능

- **회원가입 / 로그인**: 처음 접속 시 회원가입 창 표시
  - 이메일 + 비밀번호 가입/로그인
  - 구글 로그인
- **홈 대시보드**: 보관 온도, 물 탱크, 오수통 상태, 다음 식사 타이머, 지금 밥주기/세척하기 버튼

## 로컬 실행

```bash
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` 으로 접속합니다.

## 환경 변수 (Firebase)

구글 로그인 및 이메일 로그인을 사용하려면 Firebase 프로젝트가 필요합니다.

1. [Firebase Console](https://console.firebase.google.com)에서 프로젝트 생성
2. **Authentication** → **Sign-in method**에서 **이메일/비밀번호**, **Google** 사용 설정
3. 프로젝트 설정 → 일반 → 앱에서 웹 앱 추가 후 설정값 복사
4. 프로젝트 루트에 `.env` 파일 생성 후 아래 내용 채우기:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

`.env.example` 파일을 복사해 `.env`로 이름 변경 후 값을 넣어도 됩니다.

## Git에 올리기

```bash
git init
git add .
git commit -m "Initial commit: Petpresso dashboard with auth"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/petpresso.git
git push -u origin main
```

## Vercel 배포

1. [Vercel](https://vercel.com)에 로그인 후 **Add New** → **Project** 선택
2. GitHub 저장소를 연결하고 `petpresso` 프로젝트 선택
3. **Framework Preset**: **Vite** 선택. **Root Directory**는 **반드시 비워 두기**(입력란에 아무 것도 넣지 않기). **Build Command**: `npm run build`, **Output Directory**: `dist`
4. **Environment Variables**에 Firebase 관련 변수 추가:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
5. **Deploy** 클릭

배포 후 Firebase Console의 **Authentication** → **Settings** → **Authorized domains**에 Vercel 도메인(예: `your-app.vercel.app`)을 추가해야 구글/이메일 로그인이 동작합니다.

### 배포 에러: "Could not read package.json" / "ENOENT package.json"

- **원인 1 – Root Directory 설정**  
  Vercel **Settings** → **General** → **Root Directory**에 값이 있으면 지우고 비워 둡니다. (비어 있어야 저장소 루트에서 빌드합니다.)

- **원인 2 – GitHub에 파일이 없음**  
  아래처럼 `package.json`이 포함된 모든 파일을 커밋·푸시했는지 확인합니다.

```bash
git status
git add .
git commit -m "Ensure package.json and all files are committed"
git push origin master
```

GitHub 저장소 페이지에서 **package.json**, **package-lock.json**, **src** 폴더가 보여야 합니다.

## 기술 스택

- React 18, Vite 5
- React Router DOM
- Firebase Authentication (이메일/비밀번호, Google)
- CSS Modules
