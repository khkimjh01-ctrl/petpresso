import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut as firebaseSignOut,
} from 'firebase/auth'
import { auth, googleProvider, isFirebaseEnabled } from '../lib/firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [authFailed, setAuthFailed] = useState(false) // invalid-api-key 등으로 Firebase 사용 불가 시 true

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return
    }
    let unsub
    try {
      unsub = onAuthStateChanged(
        auth,
        (u) => {
          setUser(u)
          setLoading(false)
        },
        (error) => {
          console.warn('Firebase Auth 사용 불가:', error?.code || error)
          setAuthFailed(true)
          setUser(null)
          setLoading(false)
        }
      )
    } catch (e) {
      console.warn('Firebase Auth 초기화 실패:', e)
      setAuthFailed(true)
      setLoading(false)
    }
    return () => unsub?.()
  }, [])

  const signUpWithEmail = (email, password) =>
    auth
      ? createUserWithEmailAndPassword(auth, email, password)
      : Promise.reject(new Error('Firebase가 설정되지 않았습니다.'))

  const signInWithEmail = (email, password) =>
    auth
      ? signInWithEmailAndPassword(auth, email, password)
      : Promise.reject(new Error('Firebase가 설정되지 않았습니다.'))

  const signInWithGoogle = () =>
    auth
      ? signInWithPopup(auth, googleProvider)
      : Promise.reject(new Error('Firebase가 설정되지 않았습니다.'))

  const signOut = () => (auth ? firebaseSignOut(auth) : Promise.resolve())

  const value = {
    user,
    loading,
    signUpWithEmail,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    isFirebaseEnabled: () => !!auth && !authFailed,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
