import React from 'react'
import { Link } from 'react-router-dom'

const HomePage: React.FC = () => {
  return (
    <div>
      <h2>Analytics Dashboard</h2>
      <p>
        <Link to='/'>Go to login</Link>.
      </p>
    </div>
  )
}

export default HomePage
