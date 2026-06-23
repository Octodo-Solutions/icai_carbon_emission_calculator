import { createContext, useContext, useState } from 'react'
import { USERS } from '../data/users'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [mfaVerified, setMfaVerified] = useState(false)
  const [consentGiven, setConsentGiven] = useState(false)

  function login(email, password) {
    const found = USERS.find(u => u.email === email && u.password === password)
    if (found) {
      setUser(found)
      setMfaVerified(false)
      setConsentGiven(found.role !== 'branch')
      return { ok: true, user: found }
    }
    return { ok: false }
  }

  function logout() {
    setUser(null)
    setMfaVerified(false)
    setConsentGiven(false)
  }

  return (
    <AuthContext.Provider value={{ user, mfaVerified, consentGiven, login, logout, setMfaVerified, setConsentGiven }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be inside AuthProvider')
  return ctx
}
