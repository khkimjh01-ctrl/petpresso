# -*- coding: utf-8 -*-
"""
장기판 클래스 (Board)
- 9x10 교차점 좌표계
- 장기판 그리기 (선, 궁성 대각선)
- 기물 목록 관리 및 클릭 좌표 → 교차점 변환
"""

import pygame
import config
from piece import Piece
from movement import get_legal_moves


class Board:
    """
    9x10 장기판.
    - 좌표: (col, row), col 0~8, row 0~9 (row 0 = 초 쪽, row 9 = 한 쪽)
    - 교차점에만 기물 배치
    """

    def __init__(self):
        self.pieces: list[Piece] = []
        self.current_turn: str = "cho"  # 초가 선
        self.game_over: str | None = None  # None | "cho" | "han" (승자)
        self._history: list[dict] = []  # 무르기용: [{"piece", "from", "to", "captured"}]
        self._setup_initial_pieces()

    def _setup_initial_pieces(self) -> None:
        """config.INITIAL_SETUP 에 따라 기물 초기 배치."""
        self.pieces.clear()
        for (col, row), (piece_type, side) in config.INITIAL_SETUP:
            self.pieces.append(Piece(piece_type, side, col, row))

    def get_board_size_pixels(self) -> tuple[int, int]:
        """보드가 차지하는 픽셀 크기 (가로, 세로)."""
        w = (config.BOARD_COLS - 1) * config.CELL_WIDTH
        h = (config.BOARD_ROWS - 1) * config.CELL_HEIGHT
        return (w, h)

    def screen_to_intersection(self, px: int, py: int) -> tuple[int, int] | None:
        """
        화면 좌표 (px, py)를 가장 가까운 교차점 (col, row)로 변환.
        보드 밖이거나 너무 멀면 None.
        """
        # 교차점 간격의 절반 이내만 해당 교차점으로 인정
        half_w = config.CELL_WIDTH / 2
        half_h = config.CELL_HEIGHT / 2
        ox = px - config.MARGIN_LEFT
        oy = py - config.MARGIN_TOP
        col = round(ox / config.CELL_WIDTH)
        row = round(oy / config.CELL_HEIGHT)
        if col < 0 or col >= config.BOARD_COLS or row < 0 or row >= config.BOARD_ROWS:
            return None
        # 클릭이 해당 교차점 근처인지 확인
        cx = col * config.CELL_WIDTH
        cy = row * config.CELL_HEIGHT
        if abs(ox - cx) > half_w or abs(oy - cy) > half_h:
            return None
        return (col, row)

    def intersection_to_screen(self, col: int, row: int) -> tuple[int, int]:
        """교차점 (col, row)의 화면 픽셀 좌표 (중심)."""
        x = config.MARGIN_LEFT + col * config.CELL_WIDTH
        y = config.MARGIN_TOP + row * config.CELL_HEIGHT
        return (x, y)

    def get_piece_at(self, col: int, row: int) -> Piece | None:
        """해당 교차점에 있는 기물 반환. 없으면 None."""
        for p in self.pieces:
            if p.col == col and p.row == row:
                return p
        return None

    def get_piece_at_screen(self, px: int, py: int) -> Piece | None:
        """화면 좌표 (px, py) 위에 있는 기물 반환 (클릭 감지용)."""
        for p in reversed(self.pieces):  # 위에 그려진(나중에 그린) 기물 우선
            if p.contains_point(px, py):
                return p
        return None

    def clear_selection(self) -> None:
        """모든 기물의 선택 해제."""
        for p in self.pieces:
            p.selected = False

    def select_piece(self, piece: Piece | None) -> None:
        """해당 기물만 선택 상태로 하고 나머지는 해제."""
        self.clear_selection()
        if piece is not None:
            piece.selected = True

    def get_legal_moves(self, piece: Piece) -> list[tuple[int, int]]:
        """기물의 합법적 이동 목적지 (col, row) 리스트."""
        return get_legal_moves(self, piece)

    def get_king(self, side: str) -> Piece | None:
        """해당 진영의 궁(將/楚·漢) 기물 반환. 없으면 None."""
        for p in self.pieces:
            if p.piece_type == "general" and p.side == side:
                return p
        return None

    def is_in_check(self, side: str) -> bool:
        """해당 진영의 궁이 적에게 잡힐 수 있는 상태(장군)인지."""
        king = self.get_king(side)
        if king is None:
            return False
        enemy = "cho" if side == "han" else "han"
        for p in self.pieces:
            if p.side != enemy:
                continue
            moves = self.get_legal_moves(p)
            if (king.col, king.row) in moves:
                return True
        return False

    def move_piece(self, piece: Piece, to_col: int, to_row: int) -> Piece | None:
        """
        기물을 (to_col, to_row)로 이동. 그 자리에 적이 있으면 포착 제거.
        합법적 이동인지는 호출 전에 확인해야 함.
        반환: 포착한 기물(없으면 None). 왕을 잡으면 game_over 설정.
        """
        if self.game_over is not None:
            return None
        target = self.get_piece_at(to_col, to_row)
        if target is not None and target.side == piece.side:
            return None
        from_col, from_row = piece.col, piece.row
        self._history.append({
            "piece": piece,
            "from": (from_col, from_row),
            "to": (to_col, to_row),
            "captured": target,
        })
        if target is not None:
            self.pieces.remove(target)
        piece.set_position(to_col, to_row)
        if target is not None and target.piece_type == "general":
            self.game_over = piece.side  # 포착한 쪽이 승자
        return target

    def switch_turn(self) -> None:
        self.current_turn = "han" if self.current_turn == "cho" else "cho"

    def undo(self) -> bool:
        """
        마지막 수 무르기. 성공 시 True.
        턴은 무른 쪽(방금 둔 쪽)으로 되돌린다. 게임 종료 상태에서도 무르기 가능.
        """
        if not self._history:
            return False
        entry = self._history.pop()
        piece = entry["piece"]
        from_pos = entry["from"]
        to_pos = entry["to"]
        captured = entry["captured"]
        piece.set_position(from_pos[0], from_pos[1])
        if captured is not None:
            captured.set_position(to_pos[0], to_pos[1])
            self.pieces.append(captured)
        self.current_turn = piece.side
        if captured is not None and captured.piece_type == "general":
            self.game_over = None
        return True

    def draw(self, surface: pygame.Surface, font: pygame.font.Font) -> None:
        """보드(선, 궁성), 이동 가능 표시, 기물을 그린다."""
        self._draw_board_lines(surface)
        self._draw_palace_diagonals(surface)
        self._draw_legal_moves(surface)
        for p in self.pieces:
            p.draw(surface, font)

    def _draw_board_lines(self, surface: pygame.Surface) -> None:
        """9x10 교차선 그리기."""
        x0 = config.MARGIN_LEFT
        y0 = config.MARGIN_TOP
        # 세로선 9개
        for c in range(config.BOARD_COLS):
            x = x0 + c * config.CELL_WIDTH
            pygame.draw.line(
                surface, config.COLOR_LINE,
                (x, y0),
                (x, y0 + (config.BOARD_ROWS - 1) * config.CELL_HEIGHT),
                2
            )
        # 가로선 10개
        for r in range(config.BOARD_ROWS):
            y = y0 + r * config.CELL_HEIGHT
            pygame.draw.line(
                surface, config.COLOR_LINE,
                (x0, y),
                (x0 + (config.BOARD_COLS - 1) * config.CELL_WIDTH, y),
                2
            )

    def _draw_palace_diagonals(self, surface: pygame.Surface) -> None:
        """양쪽 궁성(3x3) 안의 대각선 X 그리기."""
        x0 = config.MARGIN_LEFT
        y0 = config.MARGIN_TOP
        # 궁성 왼쪽 위 ~ 오른쪽 아래, 오른쪽 위 ~ 왼쪽 아래
        for base_row, row_count in [(0, 3), (7, 3)]:
            # 궁성: col 3,4,5 / row base_row ~ base_row+2
            left = x0 + 3 * config.CELL_WIDTH
            right = x0 + 5 * config.CELL_WIDTH
            top = y0 + base_row * config.CELL_HEIGHT
            bottom = y0 + (base_row + 2) * config.CELL_HEIGHT
            pygame.draw.line(surface, config.COLOR_PALACE_DIAG, (left, top), (right, bottom), 1)
            pygame.draw.line(surface, config.COLOR_PALACE_DIAG, (right, top), (left, bottom), 1)

    def _draw_legal_moves(self, surface: pygame.Surface) -> None:
        """선택된 기물의 이동 가능 위치를 점/원으로 표시."""
        selected = next((p for p in self.pieces if p.selected), None)
        if selected is None:
            return
        moves = self.get_legal_moves(selected)
        for col, row in moves:
            x, y = self.intersection_to_screen(col, row)
            target = self.get_piece_at(col, row)
            if target is not None:
                pygame.draw.circle(surface, config.COLOR_CAPTURE_HINT, (x, y), config.MOVE_DOT_RADIUS + 2, 2)
            else:
                pygame.draw.circle(surface, config.COLOR_MOVE_DOT, (x, y), config.MOVE_DOT_RADIUS)
