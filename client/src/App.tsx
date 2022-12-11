import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import NewReviewForm from './components/NewReviewForm'
import MyReviews from './components/MyReviews'

export default function App() {
  var initialTheme: string | null = localStorage.getItem('theme')
  if (!initialTheme) initialTheme = 'light'
  const [theme, setTheme] = useState(initialTheme)

  return (
    <div
      data-theme={theme === 'dark' ? 'dark' : 'light'}
      className={`h-full ${theme === 'dark' ? 'dark' : ''} flex-row h-full w-full overflow-y-hidden bg-gray-200 dark:bg-gray-800"`}
    >
      <Navbar theme={theme} setTheme={setTheme} />

      <Routes>
        <Route path="/" element={<div>Reviews</div>} />
        <Route path="/newreview" element={<NewReviewForm />} />
        <Route path="/myreviews" element={<MyReviews />} />
      </Routes>
    </div>
  )
}
