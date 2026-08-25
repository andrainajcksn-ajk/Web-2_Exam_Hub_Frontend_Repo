import { createContext, useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { login as loginRequest } from '../api/authApi.js'
import { getToken, setToken, setUnauthorizedHandler } from '../api/client.js'

export const AuthContext = createContext(null)

const USER_KEY = 'exam_hub_user'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  })
  const [initializing, setInitializing] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const token = getToken()
    if (!token) setUser(null)
    setInitializing(false)
  }, [])

  const logout = useCallback(() => {
    setToken(null)
    localStorage.removeItem(USER_KEY)
    setUser(null)
    navigate('/login')
  }, [navigate])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setToken(null)
      localStorage.removeItem(USER_KEY)
      setUser(null)
    })
  }, [])

  async function login(email, password) {
    const data = await loginRequest(email, password)
    setToken(data.token)
    localStorage.setItem(USER_KEY, JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, initializing }}>
      {children}
    </AuthContext.Provider>
  )
}