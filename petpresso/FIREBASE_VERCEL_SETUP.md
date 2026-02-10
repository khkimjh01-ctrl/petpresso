# Firebase 설정 → Vercel 환경 변수 추가 (노란색 박스 문구 해결)

로그인 창의 "Vercel 환경 변수에 Firebase 설정을 추가한 뒤 재배포해 주세요" 문구대로 진행하는 방법입니다.

---

## 1단계: Firebase 프로젝트에서 값 복사

1. **Firebase Console** 접속: https://console.firebase.google.com  
2. 기존 프로젝트 선택 또는 **프로젝트 추가**로 새로 만듦.  
3. 왼쪽 **⚙️ 프로젝트 설정** (휠 아이콘) → **일반** 탭.  
4. 아래로 내려서 **"내 앱"** 섹션에서 **웹 앱** (</> 아이콘) 선택.  
   - 웹 앱이 없으면 **"앱 추가"** → **웹** 선택 후 앱 등록.  
5. **SDK 설정**에서 **구성** 객체가 보이면, 아래 6개 값을 복사해 둡니다.

   | 환경 변수 이름 | Firebase에서 복사할 필드 |
   |----------------|--------------------------|
   | `VITE_FIREBASE_API_KEY` | `apiKey` |
   | `VITE_FIREBASE_AUTH_DOMAIN` | `authDomain` |
   | `VITE_FIREBASE_PROJECT_ID` | `projectId` |
   | `VITE_FIREBASE_STORAGE_BUCKET` | `storageBucket` |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | `messagingSenderId` |
   | `VITE_FIREBASE_APP_ID` | `appId` |

6. **Authentication** → **Sign-in method**에서  
   - **이메일/비밀번호** 사용 설정  
   - **Google** 사용 설정  

---

## 2단계: Vercel에 환경 변수 추가

1. **Vercel** 접속: https://vercel.com  
2. **petpresso** 프로젝트 클릭.  
3. 상단 **Settings** 탭 → 왼쪽 **Environment Variables**.  
4. 아래 6개를 **하나씩** 추가 (Name / Value 정확히 입력).

   | Name (이름) | Value (값) |
   |-------------|------------|
   | `VITE_FIREBASE_API_KEY` | 1단계에서 복사한 `apiKey` |
   | `VITE_FIREBASE_AUTH_DOMAIN` | 1단계에서 복사한 `authDomain` |
   | `VITE_FIREBASE_PROJECT_ID` | 1단계에서 복사한 `projectId` |
   | `VITE_FIREBASE_STORAGE_BUCKET` | 1단계에서 복사한 `storageBucket` |
   | `VITE_FIREBASE_MESSAGING_SENDER_ID` | 1단계에서 복사한 `messagingSenderId` |
   | `VITE_FIREBASE_APP_ID` | 1단계에서 복사한 `appId` |

5. 각 변수 추가 시 **Environment**는 **Production** (필요하면 Preview도 선택).  
6. **Save** 클릭.

---

## 3단계: 재배포

1. **Deployments** 탭으로 이동.  
2. 맨 위 배포 행에서 **⋮** (세 점) 클릭.  
3. **Redeploy** 선택 후 확인.  
4. 배포가 **Ready** 될 때까지 대기.

---

## 4단계: Firebase 허용 도메인 등록

1. **Firebase Console** → **Authentication** → **Settings** (또는 **설정**) → **Authorized domains**.  
2. **도메인 추가** 클릭.  
3. Vercel 도메인 입력 (예: `petpresso-orcin.vercel.app`).  
4. 저장.

---

## 완료 후

배포된 사이트에서 **회원가입/로그인** 창을 다시 열면,  
노란색 박스가 사라지고 이메일·비밀번호·구글 로그인이 동작해야 합니다.

문제가 있으면 브라우저 **F12 → Console** 에러 메시지를 확인하세요.
