import { createContext } from 'react'
import { IUserCredentials } from '../api/user'

export interface AuthContextType {
  login: (credentials: IUserCredentials) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  isAuth: () => boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
