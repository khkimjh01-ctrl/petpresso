/**
 * PRD 2.2 승리 조건 — 8가지 줄
 * 가로 (0,1,2) (3,4,5) (6,7,8)
 * 세로 (0,3,6) (1,4,7) (2,5,8)
 * 대각선 (0,4,8) (2,4,6)
 */
export const WIN_LINES = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

/**
 * @param {string[]} board - 길이 9 배열, '' | 'x' | 'o'
 * @returns {{ player: string, line: number[] } | null}
 */
export function getWinner(board) {
  for (const [a, b, c] of WIN_LINES) {
    const va = board[a]
    const vb = board[b]
    const vc = board[c]
    if (va && va === vb && va === vc) {
      return { player: va, line: [a, b, c] }
    }
  }
  return null
}

/**
 * @param {string[]} board
 * @returns {boolean}
 */
export function isDraw(board) {
  return board.every((cell) => cell !== '')
}
