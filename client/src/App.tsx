import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import NewReviewForm from './components/NewReviewForm'

export default function App() {
  const [darkTheme, setDarkTheme] = useState(false)

  return (

      <div data-theme={darkTheme ? 'dark' : 'light'} className={`h-full ${darkTheme ? 'dark' : ''}`}>
        <Navbar darkTheme={darkTheme} setDarkTheme={setDarkTheme} />

        <Routes>
          <Route path="/" element={<div>Reviews</div>} />
          <Route path="/newreview" element={<NewReviewForm />} />
        </Routes>
      </div>

  )
}
