/**
 * 틱택토 Tic-Tac-Toe — PRD 기반 React 앱
 * F-01~F-06 필수, F-07 점수·F-08 반응형·F-09 접근성 반영
 * 화면에 PRD 문서 표시 탭 포함
 */
import { useState, useCallback } from 'react'
import { getWinner, isDraw } from './utils/gameLogic'
import Board from './components/Board'
import GameInfo from './components/GameInfo'
import GameMessage from './components/GameMessage'
import PrdView from './components/PrdView'
import './App.css'

const INITIAL_BOARD = ['', '', '', '', '', '', '', '', '']

function App() {
  const [tab, setTab] = useState('prd') // 'game' | 'prd' — 처음에 PRD가 보이도록
  const [board, setBoard] = useState(INITIAL_BOARD)
  const [currentPlayer, setCurrentPlayer] = useState('x')
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState({ x: 0, o: 0, draw: 0 })
  const [result, setResult] = useState(null) // { type: 'x'|'o'|'draw' } | null
  const [winLine, setWinLine] = useState(null) // number[] | null

  const handleCellSelect = useCallback((index) => {
    if (board[index] || gameOver) return

    const nextBoard = [...board]
    nextBoard[index] = currentPlayer
    setBoard(nextBoard)

    const winner = getWinner(nextBoard)
    if (winner) {
      setGameOver(true)
      setWinLine(winner.line)
      setResult({ type: winner.player })
      setScore((s) => ({ ...s, [winner.player]: s[winner.player] + 1 }))
      return
    }
    if (isDraw(nextBoard)) {
      setGameOver(true)
      setWinLine(null)
      setResult({ type: 'draw' })
      setScore((s) => ({ ...s, draw: s.draw + 1 }))
      return
    }

    setCurrentPlayer((p) => (p === 'x' ? 'o' : 'x'))
  }, [board, currentPlayer, gameOver])

  const handleReset = useCallback(() => {
    setBoard(INITIAL_BOARD)
    setCurrentPlayer('x')
    setGameOver(false)
    setResult(null)
    setWinLine(null)
  }, [])

  return (
    <div className="app-wrap">
      <nav className="tabs" role="tablist" aria-label="게임과 PRD 전환">
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'prd'}
          aria-controls="panel-prd"
          id="tab-prd"
          className={`tab ${tab === 'prd' ? 'tab--active' : ''}`}
          onClick={() => setTab('prd')}
        >
          PRD
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === 'game'}
          aria-controls="panel-game"
          id="tab-game"
          className={`tab ${tab === 'game' ? 'tab--active' : ''}`}
          onClick={() => setTab('game')}
        >
          게임
        </button>
      </nav>

      {tab === 'prd' && (
        <div id="panel-prd" role="tabpanel" aria-labelledby="tab-prd" className="panel">
          <PrdView />
        </div>
      )}

      {tab === 'game' && (
        <main id="panel-game" role="tabpanel" aria-labelledby="tab-game" className="panel container" aria-label="틱택토 게임">
          <h1>틱택토</h1>
          <p className="subtitle">Tic-Tac-Toe</p>

          <GameInfo currentPlayer={currentPlayer} score={score} />

          <Board
            board={board}
            winLine={winLine}
            gameOver={gameOver}
            onCellSelect={handleCellSelect}
          />

          <GameMessage result={result} />

          <div className="controls">
            <button
              type="button"
              className="btn"
              onClick={handleReset}
              aria-label="다시 하기"
            >
              다시 하기
            </button>
          </div>
        </main>
      )}
    </div>
  )
}

export default App
