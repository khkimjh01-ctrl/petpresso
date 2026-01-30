# 매트릭스 화면 보호기

매트릭스 영화처럼 녹색 코드가 아래로 떨어지는 화면 보호기입니다. 가끔 노란색으로 **에반게리온** 문구가 나타납니다.

## 구성

- **matrix.html** – 브라우저에서 바로 볼 수 있는 매트릭스 비 + 에반게리온 애니메이션
- **MatrixScreensaver** (C#) – Windows 표준 화면 보호기 실행기 (`/s`, `/c`, `/p` 지원)

## 화면 보호기 설치 방법

1. **빌드**
   - `matrix-screensaver` 폴더에서:
     ```
     dotnet build -c Release
     ```
   - 출력: `bin\Release\net48\MatrixScreensaver.exe`

2. **화면 보호기로 등록**
   - `MatrixScreensaver.exe`를 `MatrixScreensaver.scr`로 이름 변경
   - `MatrixScreensaver.scr`를 다음 중 한 곳으로 복사:
     - `C:\Windows\System32\` (관리자 권한 필요)
     - 또는 `C:\Users\[사용자이름]\Documents\` 등 원하는 폴더

3. **Windows에서 지정**
   - **설정** → **개인 설정** → **잠금 화면** → **화면 보호기 설정**
   - 또는 바탕 화면 우클릭 → **개인 설정** → **잠금 화면** → **화면 보호기 설정**
   - 목록에서 "매트릭스 화면 보호기" 선택 후 **대기 시간** 등 설정

## 실행 인자 (Windows 표준)

| 인자 | 의미 |
|------|------|
| `/s` | 전체 화면으로 화면 보호기 실행 |
| `/c` | 설정 대화 상자 표시 |
| `/p <핸들>` | 제어판 미리보기 영역에 표시 |
| `/a` | 암호 변경 (Windows에서 사용) |

- **대기 시간**, **암호 보호** 등은 Windows의 "화면 보호기 설정"에서 지정합니다.
- 이 화면 보호기의 **설정**에서는 **에반게리온 문구 표시 간격**만 조정할 수 있습니다.

## HTML 미리 보기

`matrix.html`을 브라우저에서 열면 매트릭스 비와 에반게리온 문구를 바로 확인할 수 있습니다.  
쿼리로 간격을 바꿀 수 있습니다:

- `matrix.html?evMin=10000&evMax=20000` – 에반게리온이 10~20초마다 나오도록

## 요구 사항

- **C# 프로젝트**: .NET Framework 4.8, Windows Forms
- **HTML**: 최근 브라우저(Chrome, Edge, Firefox 등)
