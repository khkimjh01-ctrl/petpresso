/**
 * 승리/무승부 결과 메시지
 */
function GameMessage({ result }) {
  if (!result) return <div className="message" aria-live="polite" />

  const { type } = result // 'x' | 'o' | 'draw'
  const text = type === 'draw' ? '무승부!' : `${type === 'x' ? 'X' : 'O'} 승리!`

  return (
    <div className={`message message--${type}`} role="status" aria-live="assertive">
      {text}
    </div>
  )
}

export default GameMessage
