import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../services/auth'

const Navigation: React.FC = () => {
  const { logout, isAuth } = useAuthContext()
  const navigate = useNavigate()
  return (
    <nav
      style={{
        borderBottom: 'solid 1px',
        paddingBottom: '1rem',
      }}
    >
      {isAuth() ? (
        <>
          <Link to='/home'>Home</Link>
          <button
            onClick={() => {
              logout()
              navigate('/home')
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <Link to='/login'>Login</Link>
      )}
    </nav>
  )
}

export default Navigation
