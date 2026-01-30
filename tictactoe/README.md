# 틱택토 Tic-Tac-Toe

PRD 기반 틱택토 웹 게임입니다. **React + Vite** 버전이 기본 실행 대상입니다.

## 프로젝트 구조

```
tictactoe/
├── PRD.md           # 제품 요구사항 문서
├── README.md        # 본 문서
├── index.html       # Vite 진입점 (React 앱)
├── package.json
├── vite.config.js
├── src/             # React 앱
│   ├── main.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   ├── utils/
│   │   └── gameLogic.js   # 승리/무승부 판정
│   └── components/
│       ├── Board.jsx
│       ├── Cell.jsx
│       ├── GameInfo.jsx
│       └── GameMessage.jsx
└── vanilla/         # 바닐라 HTML/CSS/JS 버전 (참고용)
    ├── index.html
    ├── style.css
    └── script.js
```

## 실행 방법 (React)

```bash
cd tictactoe
npm install
npm run dev
```

브라우저에서 표시되는 주소(예: `http://localhost:5173`)로 접속합니다.

- **빌드**: `npm run build`
- **프리뷰**: `npm run preview`

## 바닐라 버전

`vanilla/` 폴더 안의 `index.html`을 브라우저에서 열면 빌드 없이 바닐라 JS 버전을 실행할 수 있습니다.

## PRD 반영 사항

- **필수 (F-01~F-06)**: 보드 렌더링, 턴 제어, 승리/무승부 판정, 다시 하기, 승리 줄 강조
- **권장 (F-07~F-09)**: 점수 기록, 반응형 레이아웃, 버튼/보드 접근성(aria-label, role, focus-visible)
