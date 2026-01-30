/**
 * 틱택토 Tic-Tac-Toe 게임 (Vanilla JS)
 * 2인 대전, 승리/무승부 판정, 점수 기록
 */
const WIN_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

const board = document.getElementById('board');
const cells = document.querySelectorAll('.cell');
const currentPlayerEl = document.getElementById('current-player');
const messageEl = document.getElementById('message');
const resetBtn = document.getElementById('reset-btn');
const scoreXEl = document.getElementById('score-x');
const scoreOEl = document.getElementById('score-o');
const scoreDrawEl = document.getElementById('score-draw');

let state = {
  board: ['', '', '', '', '', '', '', '', ''],
  currentPlayer: 'x',
  gameOver: false,
  score: { x: 0, o: 0, draw: 0 }
};

function getWinner() {
  for (const [a, b, c] of WIN_LINES) {
    const va = state.board[a], vb = state.board[b], vc = state.board[c];
    if (va && va === vb && va === vc) return { player: va, line: [a, b, c] };
  }
  return null;
}

function isDraw() {
  return state.board.every(cell => cell !== '');
}

function updateUI() {
  state.board.forEach((value, i) => {
    const cell = cells[i];
    cell.textContent = value ? (value === 'x' ? '×' : '○') : '';
    cell.dataset.value = value;
    cell.disabled = state.gameOver || !!value;
  });
  currentPlayerEl.textContent = state.currentPlayer === 'x' ? 'X' : 'O';
  currentPlayerEl.classList.toggle('turn-o', state.currentPlayer === 'o');
  scoreXEl.textContent = state.score.x;
  scoreOEl.textContent = state.score.o;
  scoreDrawEl.textContent = state.score.draw;
}

function showResult(winner, line) {
  state.gameOver = true;
  if (line) {
    board.classList.add('winner');
    line.forEach(i => cells[i].classList.add('win-cell'));
  }
  if (winner) {
    state.score[winner]++;
    messageEl.textContent = (winner === 'x' ? 'X' : 'O') + ' 승리!';
    messageEl.className = 'message win-' + winner;
  } else {
    state.score.draw++;
    messageEl.textContent = '무승부!';
    messageEl.className = 'message draw';
  }
  updateUI();
}

function handleCellClick(e) {
  const cell = e.target;
  if (!cell.classList.contains('cell')) return;
  const index = parseInt(cell.dataset.index, 10);
  if (state.board[index] || state.gameOver) return;

  state.board[index] = state.currentPlayer;
  const winner = getWinner();
  if (winner) { showResult(winner.player, winner.line); return; }
  if (isDraw()) { showResult(null, null); return; }

  state.currentPlayer = state.currentPlayer === 'x' ? 'o' : 'x';
  updateUI();
}

function resetGame() {
  state.board = ['', '', '', '', '', '', '', '', ''];
  state.currentPlayer = 'x';
  state.gameOver = false;
  board.classList.remove('winner');
  cells.forEach(c => c.classList.remove('win-cell'));
  messageEl.textContent = '';
  messageEl.className = 'message';
  updateUI();
}

board.addEventListener('click', handleCellClick);
resetBtn.addEventListener('click', resetGame);
updateUI();
