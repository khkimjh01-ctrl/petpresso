# -*- coding: utf-8 -*-
"""
장기 기물 클래스 (Piece)
- 한자(한자) 또는 간단한 이미지로 렌더링
- 선택 상태 표시
"""

import pygame
import config


class Piece:
    """단일 기물을 표현하는 클래스."""

    def __init__(self, piece_type: str, side: str, col: int, row: int):
        """
        Args:
            piece_type: general, guard, horse, elephant, chariot, cannon, soldier
            side: "han" | "cho"
            col, row: 보드 좌표 (0~8, 0~9)
        """
        self.piece_type = piece_type
        self.side = side
        self.col = col
        self.row = row
        self.selected = False

    def get_hanja(self) -> str:
        """기물 종류와 진영에 맞는 한자 반환."""
        if self.piece_type == "general":
            return config.PIECE_HANJA["general_han" if self.side == "han" else "general_cho"]
        if self.piece_type == "soldier":
            return config.PIECE_HANJA["soldier_han" if self.side == "han" else "soldier_cho"]
        return config.PIECE_HANJA.get(self.piece_type, "?")

    def get_screen_pos(self) -> tuple:
        """화면 픽셀 좌표 (중심) 반환."""
        x = config.MARGIN_LEFT + self.col * config.CELL_WIDTH
        y = config.MARGIN_TOP + self.row * config.CELL_HEIGHT
        return (x, y)

    def contains_point(self, px: int, py: int) -> bool:
        """화면 좌표 (px, py)가 이 기물 위에 있는지 여부."""
        cx, cy = self.get_screen_pos()
        dx = px - cx
        dy = py - cy
        return dx * dx + dy * dy <= config.PIECE_RADIUS * config.PIECE_RADIUS

    def set_position(self, col: int, row: int) -> None:
        """보드 상 위치 변경 (이동 시 사용)."""
        self.col = col
        self.row = row

    def draw(self, surface: pygame.Surface, font: pygame.font.Font) -> None:
        """
        기물을 화면에 그린다.
        - 원형 배경 + 한자 텍스트
        - 선택 시 테두리(노란 원) 표시
        """
        cx, cy = self.get_screen_pos()
        r = config.PIECE_RADIUS

        if self.side == "han":
            bg_color = config.COLOR_HAN_PIECE_BG
            text_color = config.COLOR_HAN_PIECE_TEXT
        else:
            bg_color = config.COLOR_CHO_PIECE_BG
            text_color = config.COLOR_CHO_PIECE_TEXT

        # 배경 원
        pygame.draw.circle(surface, bg_color, (cx, cy), r)
        pygame.draw.circle(surface, config.COLOR_LINE, (cx, cy), r, 2)

        # 한자 텍스트
        text = font.render(self.get_hanja(), True, text_color)
        rect = text.get_rect(center=(cx, cy))
        surface.blit(text, rect)

        # 선택 효과: 노란 테두리
        if self.selected:
            pygame.draw.circle(surface, config.COLOR_SELECTED, (cx, cy), r + 3, 3)
