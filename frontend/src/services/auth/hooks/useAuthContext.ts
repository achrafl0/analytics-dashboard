import { useContext } from 'react'
import { AuthContextType, AuthContext } from '../authContext'

export const useAuthContext = (): AuthContextType => {
  const authctx = useContext(AuthContext) as AuthContextType
  if (!authctx) {
    console.error('no provider found, major error')
  }
  return authctx
}
