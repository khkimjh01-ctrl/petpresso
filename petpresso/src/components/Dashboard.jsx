import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import SignUpModal from './SignUpModal'
import styles from './Dashboard.module.css'

function formatTime(seconds) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [
    String(h).padStart(2, '0'),
    String(m).padStart(2, '0'),
    String(s).padStart(2, '0'),
  ]
}

export default function Dashboard() {
  const { user, loading, signOut } = useAuth()
  const [showSignUp, setShowSignUp] = useState(false)
  const [timerSeconds, setTimerSeconds] = useState(2 * 3600 + 28 * 60 + 49) // 02:28:49

  useEffect(() => {
    if (loading) return
    if (!user) {
      setShowSignUp(true)
      return
    }
    setShowSignUp(false)
  }, [user, loading])

  useEffect(() => {
    if (timerSeconds <= 0) return
    const id = setInterval(() => setTimerSeconds((s) => s - 1), 1000)
    return () => clearInterval(id)
  }, [timerSeconds])

  const [h, m, s] = formatTime(timerSeconds)

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>로딩 중...</p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      {showSignUp && <SignUpModal onClose={() => setShowSignUp(false)} />}

      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.logo}>Petpresso Premium feeder</h1>
          <p className={styles.pageLabel}>홈 대시보드</p>
        </div>
        <div className={styles.headerRight}>
          <button
            type="button"
            className={styles.settingsBtn}
            onClick={() => {}}
            aria-label="설정"
          >
            <SettingsIcon />
          </button>
          {user && (
            <button
              type="button"
              className={styles.logoutBtn}
              onClick={signOut}
            >
              로그아웃
            </button>
          )}
        </div>
      </header>

      <main className={styles.main}>
        <h2 className={styles.title}>홈 대시보드</h2>
        <p className={styles.description}>
          앱을 켜자마자 안심할 수 있는 상태를 먼저 보여드려요.
        </p>

        <section className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardLeft}>
              <span className={styles.cardIcon} aria-hidden>❄️</span>
              <span className={styles.cardValue}>4°C</span>
            </div>
            <p className={styles.cardStatus}>신선함 유지 중</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardLeft}>
              <span className={styles.cardIcon} aria-hidden>💧</span>
              <span className={styles.cardValue}>정수 충분</span>
            </div>
            <p className={styles.cardStatus}>수분 공급 준비 완료</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardRight}>
              <span className={styles.cardValue}>비움</span>
              <span className={styles.cardIcon} aria-hidden>🗑️</span>
            </div>
            <p className={styles.cardStatus}>청결 상태 양호</p>
          </div>
        </section>

        <section className={styles.timerSection}>
          <p className={styles.timerText}>
            다음 따뜻한 식사까지 2시간 28분 남았습니다
          </p>
          <div className={styles.timer}>
            <div className={styles.timerPart}>
              <span className={styles.timerNum}>{h}</span>
              <span className={styles.timerUnit}>H</span>
            </div>
            <span className={styles.timerColon}>:</span>
            <div className={styles.timerPart}>
              <span className={styles.timerNum}>{m}</span>
              <span className={styles.timerUnit}>M</span>
            </div>
            <span className={styles.timerColon}>:</span>
            <div className={styles.timerPart}>
              <span className={styles.timerNum}>{s}</span>
              <span className={styles.timerUnit}>S</span>
            </div>
          </div>
        </section>

        <section className={styles.actions}>
          <button type="button" className={styles.feedBtn}>
            <span className={styles.actionIcon}>🍽️</span>
            지금 밥주기
            <span className={styles.actionHint}>선택</span>
          </button>
          <button type="button" className={styles.cleanBtn}>
            <span className={styles.actionIcon}>🚿</span>
            지금 세척하기
            <span className={styles.actionHint}>즉시 실행</span>
          </button>
        </section>
      </main>
    </div>
  )
}

function SettingsIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="3" />
      <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
    </svg>
  )
}
