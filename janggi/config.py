# -*- coding: utf-8 -*-
"""
장기 게임 설정 상수
- 9x10 보드 (9열 x 10행, 교차점에 기물 배치)
- 한(漢, Red) / 초(楚, Blue) 진영
"""

# 보드 크기 (교차점 개수: 열 9, 행 10)
BOARD_COLS = 9
BOARD_ROWS = 10

# 화면상 셀(간격) 크기 (픽셀). 세로 간격보다 가로 간격을 약간 넓게 (장기판 비율)
CELL_WIDTH = 52
CELL_HEIGHT = 48

# 보드 그리기용 마진 (픽셀)
MARGIN_LEFT = 60
MARGIN_TOP = 50

# 기물 원 반지름
PIECE_RADIUS = 22

# 색상 (RGB)
COLOR_BOARD_BG = (218, 180, 120)      # 나무색 배경
COLOR_LINE = (60, 40, 20)              # 선
COLOR_PALACE_DIAG = (80, 55, 30)      # 궁성 대각선
COLOR_HAN_PIECE_BG = (200, 70, 50)    # 한(紅) 기물 배경
COLOR_HAN_PIECE_TEXT = (255, 240, 220)
COLOR_CHO_PIECE_BG = (50, 90, 140)    # 초(靑) 기물 배경
COLOR_CHO_PIECE_TEXT = (220, 235, 255)
COLOR_SELECTED = (255, 220, 0)        # 선택 시 테두리
COLOR_SELECTED_ALPHA = 180
COLOR_MOVE_DOT = (80, 80, 80)         # 이동 가능(빈 칸) 표시
COLOR_CAPTURE_HINT = (200, 60, 60)    # 포착 가능(적 기물) 표시
MOVE_DOT_RADIUS = 8
INFO_HEIGHT = 28
COLOR_TEXT = (40, 35, 30)
COLOR_CHECK = (180, 50, 50)
COLOR_GAME_OVER = (80, 20, 20)

# 궁성 범위 (열, 행). 한쪽 궁성 3x3
PALACE_COLS = (3, 4, 5)   # col 3,4,5
PALACE_TOP_ROWS = (0, 1, 2)   # Cho 궁성
PALACE_BOTTOM_ROWS = (7, 8, 9)  # Han 궁성

# 기물 종류별 한자 (한/초 동일한 글자 사용, 진영은 색으로 구분)
# General: 한 漢 / 초 楚
PIECE_HANJA = {
    "general_han": "漢",
    "general_cho": "楚",
    "guard": "士",
    "horse": "馬",
    "elephant": "象",
    "chariot": "車",
    "cannon": "包",
    "soldier_han": "兵",
    "soldier_cho": "卒",
}

# 초기 배치: (col, row) -> (piece_type, side)
# side: "han" | "cho"
# piece_type: general, guard, horse, elephant, chariot, cannon, soldier
INITIAL_SETUP = [
    # Cho (row 0~3)
    ((0, 0), ("chariot", "cho")),
    ((1, 0), ("horse", "cho")),
    ((2, 0), ("elephant", "cho")),
    ((3, 0), ("guard", "cho")),
    ((5, 0), ("guard", "cho")),
    ((6, 0), ("elephant", "cho")),
    ((7, 0), ("horse", "cho")),
    ((8, 0), ("chariot", "cho")),
    ((4, 1), ("general", "cho")),
    ((1, 2), ("cannon", "cho")),
    ((7, 2), ("cannon", "cho")),
    ((0, 3), ("soldier", "cho")),
    ((2, 3), ("soldier", "cho")),
    ((4, 3), ("soldier", "cho")),
    ((6, 3), ("soldier", "cho")),
    ((8, 3), ("soldier", "cho")),
    # Han (row 6~9)
    ((0, 9), ("chariot", "han")),
    ((1, 9), ("horse", "han")),
    ((2, 9), ("elephant", "han")),
    ((3, 9), ("guard", "han")),
    ((5, 9), ("guard", "han")),
    ((6, 9), ("elephant", "han")),
    ((7, 9), ("horse", "han")),
    ((8, 9), ("chariot", "han")),
    ((4, 8), ("general", "han")),
    ((1, 7), ("cannon", "han")),
    ((7, 7), ("cannon", "han")),
    ((0, 6), ("soldier", "han")),
    ((2, 6), ("soldier", "han")),
    ((4, 6), ("soldier", "han")),
    ((6, 6), ("soldier", "han")),
    ((8, 6), ("soldier", "han")),
]
