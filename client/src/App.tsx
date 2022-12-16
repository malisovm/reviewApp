import React from 'react'
import { Routes, Route } from 'react-router-dom'
import ReviewEditor from './pages/ReviewEditor'
import Main from './pages/Main'
import MyReviews from './pages/MyReviews'
import { useAppSelector } from './redux/hooks'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Message from './components/Alert'

export default function App() {
  const theme = useAppSelector((state) => state.local.theme)

  return (
    <div
      data-theme={theme === 'dark' ? 'dark' : 'light'}
      className={`${theme === 'dark' ? 'dark' : ''} bg-gray-200 dark:bg-gray-800 min-h-screen flex-row`}
    >
      <Navbar />
      <Message />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/revieweditor" element={<ReviewEditor />} />
        <Route path="/myreviews" element={<MyReviews />} />
      </Routes>
    </div>
  )
}
