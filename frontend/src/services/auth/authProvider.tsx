import React, { useState, useEffect, PropsWithChildren } from 'react'
import { AuthContext, AuthContextType } from './authContext'
import { login, logout } from '../api/user'
import { httpClient } from '../http'
import { LocalSession } from '../localStorage'

export const AuthProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [session, setSession] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (session) return
    setLoading(true)
    const localSession = LocalSession.get()
    if (localSession) {
      setSession(localSession)
      httpClient.setAuthorization(localSession)
    }
    setLoading(false)
  }, [session])

  const logoutProvider = async () => {
    await logout()
    LocalSession.reset()
    setSession(null)
    httpClient.deleteAuthorization()
  }

  const contextValue: AuthContextType = {
    loading,
    login: async ({ identifiant, password }) => {
      setLoading(true)
      if (!(identifiant.length > 0) || !(password.length > 0)) {
        throw new Error('The mail or password was not provided')
      }
      try {
        const { session_token: sessionToken } = await login({ identifiant, password })
        setSession(sessionToken)
        LocalSession.set(sessionToken)
        httpClient.setAuthorization(sessionToken)
      } catch {
        throw new Error('Error while login')
      } finally {
        setLoading(false)
      }
    },
    logout: logoutProvider,
    isAuth: () => session !== null,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
