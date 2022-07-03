import React from 'react'
import Navigation from './components/Navigation'
import { PrivatedRoute } from './components/PrivateRoute'
import HomePage from './views/HomePage'
import LoginPage from './views/LoginPage'
import { Routes, Route } from 'react-router-dom'
import ChartPage from './views/ChartPage'

const App: React.FC = () => {
  return (
    <>
      <Navigation />

      <Routes>
        <Route path='login' element={<LoginPage />}></Route>
        <Route path='home' element={<HomePage />}></Route>
        <Route
          path='chart'
          element={
            <PrivatedRoute>
              <ChartPage />
            </PrivatedRoute>
          }
        ></Route>
      </Routes>
    </>
  )
}

export default App
