import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')) } catch { return null }
  })

  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user || null))
  }, [user])

  const login = async (username, password) => {
    // simple mock auth via json-server
    const res = await axios.get(`http://localhost:4000/users?username=${username}&password=${password}`)
    const found = res.data[0]
    if (found) {
      setUser(found)
      return { ok: true }
    } else {
      return { ok: false, message: 'Invalid credentials' }
    }
  }

  const logout = () => setUser(null)

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
