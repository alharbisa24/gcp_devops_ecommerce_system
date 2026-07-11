/* eslint-disable react-refresh/only-export-components -- provider + hook pattern */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { loginUser, registerUser } from '../api/auth'

const AuthContext = createContext(null)
const STORAGE_KEY = 'auth_user'

function readStored() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const u = JSON.parse(raw)
    if (u && typeof u.email === 'string') return u
  } catch {
    /* ignore */
  }
  return null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(readStored)

  const login = useCallback(async (email, password) => {
    const response = await loginUser({ email, password })
    const next = { ...response.user, token: response.access_token }
    setUser(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return next
  }, [])

  const register = useCallback(async (email, password, username = email.split('@')[0], fullName = '') => {
    const response = await registerUser({ email, username, full_name: fullName, password })
    const next = { ...response, token: null }
    setUser(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    return next
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  const value = useMemo(
    () => ({ user, login, register, logout, isAuthenticated: !!user }),
    [user, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
