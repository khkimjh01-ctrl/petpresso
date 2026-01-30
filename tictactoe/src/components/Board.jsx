/**
 * F-01 보드 렌더링, F-06 승리 줄 강조
 */
import Cell from './Cell.jsx'

function Board({ board, winLine, gameOver, onCellSelect }) {
  const hasWinner = winLine && winLine.length === 3

  return (
    <div
      className={`board ${hasWinner ? 'board--winner' : ''}`}
      role="grid"
      aria-label="틱택토 3×3 보드"
    >
      {board.map((value, i) => (
        <Cell
          key={i}
          value={value}
          index={i}
          isWin={hasWinner && winLine.includes(i)}
          disabled={gameOver || !!value}
          onSelect={onCellSelect}
        />
      ))}
    </div>
  )
}

export default Board
