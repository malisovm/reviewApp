import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setTheme } from '../redux/globalVarsSlice'

export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.globalVars.theme)

  function toggleTheme() {
    let newTheme: string = theme === 'light' ? 'dark' : 'light'
    dispatch(setTheme(newTheme))
    localStorage.setItem('theme', newTheme)
  }

  return (
    <div className="flex h-16 mb-3 justify-between items-center bg-gray-900 dark:bg-gray-200">
      <button
        className="italic text-2xl m-3 text-primary font-bold"
        onClick={() => {
          navigate('/')
        }}
      >
        RatingApp
      </button>
      <span className="space-x-3 m-2">
        <button
          className="btn btn-active btn-primary"
          onClick={() => {
            navigate('/newreview')
          }}
        >
          New review
        </button>
        <button
          className="btn btn-active btn-primary"
          onClick={() => {
            navigate('/myreviews')
          }}
        >
          My reviews
        </button>
        <input type="checkbox" className="toggle toggle-primary cursor-pointer align-middle" onClick={toggleTheme} />
      </span>
    </div>
  )
}
