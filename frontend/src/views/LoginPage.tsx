import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthContext } from '../services/auth'

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const { login, loading } = useAuthContext()
  const navigate = useNavigate()
  const handleSubmitButton = async () => {
    await login({ identifiant: email, password })
    navigate('/chart')
  }
  return (
    <div>
      <h2>Login</h2>
      <form>
        <p>
          <label>Email</label>
          <br />
          <input type='text' required onChange={(e) => setEmail(e.target.value)} value={email} />
        </p>
        <p>
          <label>Password</label>
          <br />
          <input
            type='password'
            required
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </p>
        <p>
          <button type='submit' disabled={loading} onClick={handleSubmitButton}>
            {loading ? 'Loading...' : 'Login'}
          </button>
        </p>
      </form>
      <footer>
        <p>
          <Link to='/'>Back to Homepage</Link>.
        </p>
      </footer>
    </div>
  )
}

export default LoginPage
