import React, { PropsWithChildren } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuthContext } from '../services/auth'

export const PrivatedRoute: React.FC<PropsWithChildren> = ({ children }) => {
  const { isAuth, loading } = useAuthContext()
  if (loading) {
    return <div>Loading...</div>
  }
  if (!isAuth()) {
    // user is not authenticated
    return <Navigate to='/login' />
  }
  return <>{children}</>
}
