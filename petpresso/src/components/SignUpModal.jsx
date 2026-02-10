import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './SignUpModal.module.css'

export default function SignUpModal({ onClose }) {
  const { signUpWithEmail, signInWithEmail, signInWithGoogle, isFirebaseEnabled } = useAuth()
  const [mode, setMode] = useState('signup') // 'signup' | 'signin'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'signup'
  const firebaseReady = isFirebaseEnabled()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!email.trim() || !password) {
      setError('이메일과 비밀번호를 입력해 주세요.')
      return
    }
    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.')
      return
    }
    setLoading(true)
    try {
      if (isSignUp) {
        await signUpWithEmail(email.trim(), password)
      } else {
        await signInWithEmail(email.trim(), password)
      }
      onClose()
    } catch (err) {
      const msg =
        err.code === 'auth/email-already-in-use'
          ? '이미 사용 중인 이메일입니다.'
          : err.code === 'auth/invalid-email'
            ? '올바른 이메일을 입력해 주세요.'
            : err.code === 'auth/weak-password'
              ? '비밀번호는 6자 이상이어야 합니다.'
              : err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password'
                ? '이메일 또는 비밀번호가 올바르지 않습니다.'
                : err.message || '오류가 발생했습니다.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
      onClose()
    } catch (err) {
      setError(err.message || '구글 로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button type="button" className={styles.close} onClick={onClose} aria-label="닫기">
          ×
        </button>
        <h2 className={styles.title}>
          {isSignUp ? '회원가입' : '로그인'}
        </h2>
        <p className={styles.subtitle}>
          {isSignUp
            ? '아이디(이메일)와 비밀번호 또는 구글 계정으로 가입하세요.'
            : '이메일과 비밀번호 또는 구글 계정으로 로그인하세요.'}
        </p>

        {!firebaseReady && (
          <p className={styles.warn}>
            로그인 기능을 사용하려면 Vercel 환경 변수에 Firebase 설정을 추가한 뒤 재배포해 주세요. 지금은 대시보드를 둘러보실 수 있습니다.
          </p>
        )}

        <div className={styles.tabs}>
          <button
            type="button"
            className={mode === 'signup' ? styles.tabActive : styles.tab}
            onClick={() => setMode('signup')}
          >
            회원가입
          </button>
          <button
            type="button"
            className={mode === 'signin' ? styles.tabActive : styles.tab}
            onClick={() => setMode('signin')}
          >
            로그인
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>이메일</label>
          <input
            type="email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@email.com"
            autoComplete="email"
            disabled={loading}
          />
          <label className={styles.label}>비밀번호</label>
          <input
            type="password"
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6자 이상"
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
            disabled={loading}
          />
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.primaryBtn} disabled={loading || !firebaseReady}>
            {loading ? '처리 중...' : isSignUp ? '가입하기' : '로그인'}
          </button>
        </form>

        <div className={styles.divider}>
          <span>또는</span>
        </div>

        <button
          type="button"
          className={styles.googleBtn}
          onClick={handleGoogle}
          disabled={loading || !firebaseReady}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          구글 로그인
        </button>
      </div>
    </div>
  )
}
