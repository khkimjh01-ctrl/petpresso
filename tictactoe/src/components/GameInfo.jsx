/**
 * F-02 턴 제어, F-07 점수 기록
 */
function GameInfo({ currentPlayer, score }) {
  const isO = currentPlayer === 'o'

  return (
    <div className="game-info" aria-live="polite">
      <span className="turn-indicator">
        현재 차례: <strong id="current-player" className={isO ? 'turn-o' : ''}>{currentPlayer === 'x' ? 'X' : 'O'}</strong>
      </span>
      <span className="score-board" aria-label="점수">
        <span>X: <span id="score-x">{score.x}</span></span>
        <span>O: <span id="score-o">{score.o}</span></span>
        <span>무: <span id="score-draw">{score.draw}</span></span>
      </span>
    </div>
  )
}

export default GameInfo
