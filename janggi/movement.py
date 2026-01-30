# -*- coding: utf-8 -*-
"""
장기 기물 이동 규칙
- 차(車), 포(包), 마(馬), 상(象), 졸/병, 사(士), 궁(將/楚·漢)의 합법적 이동 경로 계산
- 포: 기물 하나를 반드시 넘어서만 이동/포착, 궁성 대각선에서도 동일
- 궁성 내 대각선 이동: 궁성 X자 선 위에서만 대각선 이동
"""

from __future__ import annotations

import config
from piece import Piece

# 타입: Board는 순환 참조 방지를 위해 문자열로 (또는 get_piece_at 등만 사용)


def _is_in_bounds(col: int, row: int) -> bool:
    return 0 <= col < config.BOARD_COLS and 0 <= row < config.BOARD_ROWS


def _is_cho_palace(col: int, row: int) -> bool:
    return col in (3, 4, 5) and row in (0, 1, 2)


def _is_han_palace(col: int, row: int) -> bool:
    return col in (3, 4, 5) and row in (7, 8, 9)


def _is_in_palace(col: int, row: int, side: str) -> bool:
    return _is_cho_palace(col, row) if side == "cho" else _is_han_palace(col, row)


# 궁성 대각선: 한 줄로 이어진 점들 (차·포가 직선으로 이동할 수 있는 대각선)
# 초 궁: (3,0)-(4,1)-(5,2), (5,0)-(4,1)-(3,2)
# 한 궁: (3,7)-(4,8)-(5,9), (5,7)-(4,8)-(3,9)
PALACE_DIAGONALS_CHO = [
    [(3, 0), (4, 1), (5, 2)],
    [(5, 0), (4, 1), (3, 2)],
]
PALACE_DIAGONALS_HAN = [
    [(3, 7), (4, 8), (5, 9)],
    [(5, 7), (4, 8), (3, 9)],
]


def _get_palace_diagonal_lines(side: str) -> list[list[tuple[int, int]]]:
    return PALACE_DIAGONALS_CHO if side == "cho" else PALACE_DIAGONALS_HAN


def _get_palace_orthogonal_neighbors(col: int, row: int, side: str) -> list[tuple[int, int]]:
    """궁성 내에서 상하좌우 한 칸 이웃 (궁성 안에 있는 것만)."""
    cands = [(col + 1, row), (col - 1, row), (col, row + 1), (col, row - 1)]
    return [(c, r) for c, r in cands if _is_in_bounds(c, r) and _is_in_palace(c, r, side)]


def _get_palace_diagonal_neighbors(col: int, row: int, side: str) -> list[tuple[int, int]]:
    """궁성 내에서 대각선(X자)으로 연결된 한 칸 이웃."""
    lines = _get_palace_diagonal_lines(side)
    out = []
    for line in lines:
        try:
            i = line.index((col, row))
            if i - 1 >= 0:
                out.append(line[i - 1])
            if i + 1 < len(line):
                out.append(line[i + 1])
        except ValueError:
            pass
    return out


def _get_palace_all_neighbors(col: int, row: int, side: str) -> list[tuple[int, int]]:
    """궁·사: 궁성 내 직선+대각선 한 칸 이웃 (중복 제거)."""
    s = set(_get_palace_orthogonal_neighbors(col, row, side))
    s.update(_get_palace_diagonal_neighbors(col, row, side))
    return list(s)


def get_legal_moves(board, piece: Piece) -> list[tuple[int, int]]:
    """
    기물의 합법적 이동 목적지 (col, row) 리스트 반환.
    아군이 있는 칸은 제외. 빈 칸 또는 적 기물이 있는 칸만 포함.
    """
    get_at = board.get_piece_at
    side = piece.side
    enemy = "cho" if side == "han" else "han"
    c, r = piece.col, piece.row
    moves: list[tuple[int, int]] = []

    def add_if_ok(col: int, row: int) -> None:
        if not _is_in_bounds(col, row):
            return
        p = get_at(col, row)
        if p is None:
            moves.append((col, row))
        elif p.side == enemy:
            moves.append((col, row))  # 포착 가능

    # --- 궁 (將/楚·漢) ---
    if piece.piece_type == "general":
        for nc, nr in _get_palace_all_neighbors(c, r, side):
            add_if_ok(nc, nr)
        return moves

    # --- 사 (士) ---
    if piece.piece_type == "guard":
        for nc, nr in _get_palace_all_neighbors(c, r, side):
            add_if_ok(nc, nr)
        return moves

    # --- 차 (車): 직선(가로·세로) + 궁성 내 대각선 ---
    if piece.piece_type == "chariot":
        # 가로
        for dc in (-1, 1):
            nc, nr = c + dc, r
            while _is_in_bounds(nc, nr):
                p = get_at(nc, nr)
                if p is None:
                    moves.append((nc, nr))
                    nc += dc
                else:
                    if p.side == enemy:
                        moves.append((nc, nr))
                    break
        # 세로
        for dr in (-1, 1):
            nc, nr = c, r + dr
            while _is_in_bounds(nc, nr):
                p = get_at(nc, nr)
                if p is None:
                    moves.append((nc, nr))
                    nr += dr
                else:
                    if p.side == enemy:
                        moves.append((nc, nr))
                    break
        # 궁성 대각선 (양쪽 궁성 모두)
        for diag_line in PALACE_DIAGONALS_CHO + PALACE_DIAGONALS_HAN:
            if (c, r) not in diag_line:
                continue
            idx = diag_line.index((c, r))
            # 한 방향
            for i in range(idx - 1, -1, -1):
                nc, nr = diag_line[i]
                p = get_at(nc, nr)
                if p is None:
                    moves.append((nc, nr))
                else:
                    if p.side == enemy:
                        moves.append((nc, nr))
                    break
            # 반대 방향
            for i in range(idx + 1, len(diag_line)):
                nc, nr = diag_line[i]
                p = get_at(nc, nr)
                if p is None:
                    moves.append((nc, nr))
                else:
                    if p.side == enemy:
                        moves.append((nc, nr))
                    break
        return moves

    # --- 포 (包): 정확히 한 기물을 넘은 뒤, 그 방향으로 빈 칸은 모두 착지 가능. 첫 번째 적(비포)은 포착 가능. 포는 넘을 수 없고 포는 잡을 수 없음 ---
    if piece.piece_type == "cannon":
        # 가로: 한 기물을 넘은 다음, 그 뒤로 빈 칸은 모두 이동 가능, 적(비포) 한 개는 포착 가능
        for dc in (-1, 1):
            pos = c + dc
            hurdle = None  # 넘은 기물 위치 (정확히 하나여야 함)
            while _is_in_bounds(pos, r):
                p = get_at(pos, r)
                if p is None:
                    if hurdle is not None:
                        moves.append((pos, r))
                    pos += dc
                    continue
                if hurdle is None:
                    if p.piece_type == "cannon":
                        break
                    hurdle = (pos, r)
                    pos += dc
                    continue
                if p.side == enemy and p.piece_type != "cannon":
                    moves.append((pos, r))
                break
        # 세로
        for dr in (-1, 1):
            pos = r + dr
            hurdle = None
            while _is_in_bounds(c, pos):
                p = get_at(c, pos)
                if p is None:
                    if hurdle is not None:
                        moves.append((c, pos))
                    pos += dr
                    continue
                if hurdle is None:
                    if p.piece_type == "cannon":
                        break
                    hurdle = (c, pos)
                    pos += dr
                    continue
                if p.side == enemy and p.piece_type != "cannon":
                    moves.append((c, pos))
                break
        # 궁성 대각선: 중심에 정확히 한 기물이 있을 때만 반대쪽 끝으로 이동/포착
        for diag_line in PALACE_DIAGONALS_CHO + PALACE_DIAGONALS_HAN:
            if (c, r) not in diag_line:
                continue
            idx = diag_line.index((c, r))
            if len(diag_line) != 3:
                continue
            # 포는 궁성 대각선에서 끝에 있을 때만 이동: (끝) - (중심) - (끝). 중심에 정확히 1개 기물
            center = diag_line[1]
            pc = get_at(center[0], center[1])
            if pc is None:
                continue
            if pc.piece_type == "cannon":
                continue
            # 중심에 비포 기물 1개 있음 -> 반대 끝으로 이동/포착 가능
            if idx == 0:
                target_pos = diag_line[2]
            elif idx == 2:
                target_pos = diag_line[0]
            else:
                continue
            target = get_at(target_pos[0], target_pos[1])
            if target is None:
                moves.append(target_pos)
            elif target.side == enemy and target.piece_type != "cannon":
                moves.append(target_pos)
        return moves

    # --- 마 (馬): 1직선 + 1대각선, 첫 걸음에 기물 있으면 그 방향 불가 ---
    if piece.piece_type == "horse":
        # 8방: (dc,dr) 최종 이동. 다리: (dc//2, dr//2) 또는 한쪽 0
        steps = [
            (2, 1), (2, -1), (-2, 1), (-2, -1),
            (1, 2), (1, -2), (-1, 2), (-1, -2),
        ]
        leg = [
            (1, 0), (1, 0), (-1, 0), (-1, 0),
            (0, 1), (0, -1), (0, 1), (0, -1),
        ]
        for k, ((dc, dr), (lc, lr)) in enumerate(zip(steps, leg)):
            leg_c, leg_r = c + lc, r + lr
            if not _is_in_bounds(leg_c, leg_r):
                continue
            if get_at(leg_c, leg_r) is not None:
                continue
            nc, nr = c + dc, r + dr
            if not _is_in_bounds(nc, nr):
                continue
            p = get_at(nc, nr)
            if p is not None and p.side == side:
                continue
            moves.append((nc, nr))
        return moves

    # --- 상 (象): 1직선 + 2대각선(2×3 직사각형 반대 꼭지), 첫 걸음·대각 중간에 기물 있으면 불가 ---
    if piece.piece_type == "elephant":
        # 8방: (±2,±3), (±3,±2). 첫 걸음 직선 1, 그 다음 대각 2칸
        steps = [
            (2, 3), (2, -3), (-2, 3), (-2, -3),
            (3, 2), (3, -2), (-3, 2), (-3, -2),
        ]
        leg1 = [
            (0, 1), (0, -1), (0, 1), (0, -1),
            (1, 0), (1, 0), (-1, 0), (-1, 0),
        ]
        leg2_mid = [
            (1, 2), (1, -2), (-1, 2), (-1, -2),
            (1, 1), (1, -1), (-1, 1), (-1, -1),
        ]
        for (dc, dr), (l1c, l1r), (l2c, l2r) in zip(steps, leg1, leg2_mid):
            if not _is_in_bounds(c + dc, r + dr):
                continue
            if get_at(c + l1c, r + l1r) is not None:
                continue
            if get_at(c + l2c, r + l2r) is not None:
                continue
            nc, nr = c + dc, r + dr
            p = get_at(nc, nr)
            if p is not None and p.side == side:
                continue
            moves.append((nc, nr))
        return moves

    # --- 졸/병 ---
    if piece.piece_type == "soldier":
        if side == "cho":
            # 초: 전진 = row 증가 (아래)
            forward_drs = [1]
            fwd_diag = [(1, 1), (-1, 1)]
        else:
            forward_drs = [-1]
            fwd_diag = [(1, -1), (-1, -1)]
        # 직선: 전진 1, 옆 1
        for dc, dr in [(-1, 0), (1, 0)] + [(0, d) for d in forward_drs]:
            nc, nr = c + dc, r + dr
            add_if_ok(nc, nr)
        # 적 궁성 안에서는 대각선 전진 1칸 (궁성 대각선 위에서만)
        enemy_palace_diags = PALACE_DIAGONALS_HAN if side == "cho" else PALACE_DIAGONALS_CHO
        if (c, r) in [pt for line in enemy_palace_diags for pt in line]:
            for dc, dr in fwd_diag:
                nc, nr = c + dc, r + dr
                if not _is_in_bounds(nc, nr):
                    continue
                if (nc, nr) not in [pt for line in enemy_palace_diags for pt in line]:
                    continue
                add_if_ok(nc, nr)
        return moves

    return []
