import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import NewReviewForm from './components/NewReviewForm'
import Main from './pages/Main'
import MyReviews from './pages/MyReviews'
import { useAppSelector } from './redux/hooks'

export default function App() {
  const theme = useAppSelector((state) => state.globalVars.theme)

  return (
    <div
      data-theme={theme === 'dark' ? 'dark' : 'light'}
      className={`${theme === 'dark' ? 'dark' : ''} bg-gray-200 dark:bg-gray-800 min-h-screen flex-row`}
    >
      <Navbar />

      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/newreview" element={<NewReviewForm />} />
        <Route path="/myreviews" element={<MyReviews />} />
      </Routes>
    </div>
  )
}
