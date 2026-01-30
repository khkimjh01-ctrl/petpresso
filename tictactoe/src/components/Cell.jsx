/**
 * F-01 보드 렌더링 — 칸 하나
 * PRD 4.5 접근성: button, aria-label
 */
function Cell({ value, index, isWin, disabled, onSelect }) {
  const label = value ? `${value === 'x' ? 'X' : 'O'} (${index + 1}번 칸)` : `${index + 1}번 칸, 빈 칸`
  const display = value ? (value === 'x' ? '×' : '○') : ''

  return (
    <button
      type="button"
      className={`cell ${value ? `cell--${value}` : ''} ${isWin ? 'cell--win' : ''}`}
      aria-label={label}
      disabled={disabled}
      onClick={() => onSelect(index)}
      data-value={value || undefined}
    >
      {display}
    </button>
  )
}

export default Cell
