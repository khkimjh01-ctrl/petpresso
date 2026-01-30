# -*- coding: utf-8 -*-
"""
장기 게임 메인 진입점
- 초/한 턴 시스템, 포착 시 보드에서 제거
- 장군(Check) 표시, 왕 잡히면 게임 종료 메시지
- 무르기(U 키) 히스토리
"""

import os
import sys
import pygame
import config
from board import Board


def _can_render_hanja(font: pygame.font.Font) -> bool:
    """폰트가 한자(漢)를 제대로 그릴 수 있는지 확인."""
    try:
        s = font.render("漢", True, (0, 0, 0))
        return s.get_width() >= 8 and s.get_height() >= 8
    except Exception:
        return False


def _get_hanja_font(size: int) -> pygame.font.Font:
    """
    한자/한글을 지원하는 폰트를 찾아 반환.
    Windows 폰트 경로 → SysFont 이름 순으로 시도.
    """
    # 1) Windows Fonts 폴더에서 TTF/TTC 파일 직접 로드 (가장 확실)
    windir = os.environ.get("WINDIR", "C:\\Windows")
    font_dir = os.path.join(windir, "Fonts")
    font_files = [
        "malgun.ttf",
        "malgunbd.ttf",
        "gulim.ttc",
        "batang.ttc",
        "batangche.ttc",
        "gungsuh.ttc",
        "gungsuhche.ttc",
        "dotum.ttc",
        "dotumche.ttc",
    ]
    for name in font_files:
        path = os.path.join(font_dir, name)
        if os.path.isfile(path):
            try:
                f = pygame.font.Font(path, size)
                if _can_render_hanja(f):
                    return f
            except Exception:
                continue

    # 2) SysFont로 한글/한자 폰트 이름 여러 가지 시도
    names = [
        "Malgun Gothic",
        "malgun",
        "맑은 고딕",
        "Gulim",
        "gulim",
        "굴림",
        "Batang",
        "batang",
        "바탕",
        "Gungsuh",
        "궁서",
        "Dotum",
        "돋움",
        "NanumGothic",
        "나눔고딕",
        "AppleGothic",
    ]
    for name in names:
        try:
            f = pygame.font.SysFont(name, size)
            if _can_render_hanja(f):
                return f
        except Exception:
            continue

    # 3) 시스템 폰트 목록에서 이름에 gothic/gulim/malgun/batang 포함된 것 시도
    try:
        for name in pygame.font.get_fonts():
            low = name.lower()
            if "malgun" in low or "gulim" in low or "batang" in low or "gothic" in low or "gungsuh" in low or "dotum" in low:
                try:
                    f = pygame.font.SysFont(name, size)
                    if _can_render_hanja(f):
                        return f
                except Exception:
                    continue
    except Exception:
        pass

    # 4) 마지막: 기본 폰트 (한자는 깨질 수 있음)
    return pygame.font.Font(None, size)


def draw_info(screen: pygame.Surface, font: pygame.font.Font, board: Board, info_font: pygame.font.Font | None = None) -> None:
    """상단에 턴/장군/게임종료 문구 표시."""
    if info_font is None:
        info_font = font
    y = 8
    if board.game_over is not None:
        winner = "초(楚)" if board.game_over == "cho" else "한(漢)"
        text = info_font.render(f"{winner} 승리! 왕을 잡았습니다. 게임 종료.", True, config.COLOR_GAME_OVER)
        screen.blit(text, (config.MARGIN_LEFT, y))
        text2 = info_font.render("창을 닫거나 새 게임을 시작하세요.", True, config.COLOR_TEXT)
        screen.blit(text2, (config.MARGIN_LEFT, y + 22))
        return
    turn_label = "초(楚) 차례" if board.current_turn == "cho" else "한(漢) 차례"
    text = info_font.render(turn_label, True, config.COLOR_TEXT)
    screen.blit(text, (config.MARGIN_LEFT, y))
    if board.is_in_check(board.current_turn):
        check_text = info_font.render("  [ 장군! ]", True, config.COLOR_CHECK)
        screen.blit(check_text, (config.MARGIN_LEFT + text.get_width() + 8, y))
    undo_hint = info_font.render("  (U: 무르기)", True, config.COLOR_TEXT)
    screen.blit(undo_hint, (config.MARGIN_LEFT + 220, y))


def main() -> None:
    pygame.init()
    pygame.display.set_caption("장기 (Janggi)")

    board_w = (config.BOARD_COLS - 1) * config.CELL_WIDTH
    board_h = (config.BOARD_ROWS - 1) * config.CELL_HEIGHT
    screen_w = board_w + config.MARGIN_LEFT * 2
    screen_h = board_h + config.MARGIN_TOP * 2

    screen = pygame.display.set_mode((screen_w, screen_h))
    screen.fill(config.COLOR_BOARD_BG)

    font_size = 28
    font = _get_hanja_font(font_size)
    info_font = _get_hanja_font(18)

    board = Board()
    clock = pygame.time.Clock()
    running = True

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_u:
                    board.undo()
            elif event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                if board.game_over is not None:
                    continue
                mx, my = event.pos
                clicked_piece = board.get_piece_at_screen(mx, my)
                intersection = board.screen_to_intersection(mx, my)
                selected = next((p for p in board.pieces if p.selected), None)

                if selected is not None:
                    if selected.side != board.current_turn:
                        board.clear_selection()
                        continue
                    moves = board.get_legal_moves(selected)
                    if intersection and intersection in moves:
                        board.move_piece(selected, intersection[0], intersection[1])
                        if board.game_over is None:
                            board.switch_turn()
                        board.clear_selection()
                    elif clicked_piece is not None:
                        if clicked_piece.side == board.current_turn:
                            board.select_piece(clicked_piece)
                        elif (clicked_piece.col, clicked_piece.row) in moves:
                            board.move_piece(selected, clicked_piece.col, clicked_piece.row)
                            if board.game_over is None:
                                board.switch_turn()
                            board.clear_selection()
                        else:
                            board.clear_selection()
                    else:
                        board.clear_selection()
                else:
                    if clicked_piece is not None and clicked_piece.side == board.current_turn:
                        board.select_piece(clicked_piece)
                    else:
                        board.clear_selection()

        screen.fill(config.COLOR_BOARD_BG)
        draw_info(screen, font, board, info_font)
        board.draw(screen, font)
        pygame.display.flip()
        clock.tick(60)

    pygame.quit()
    sys.exit(0)


if __name__ == "__main__":
    main()
