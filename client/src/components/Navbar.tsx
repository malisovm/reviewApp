import React from 'react'
import { useNavigate } from 'react-router-dom'

interface IProps {
  theme: string
  setTheme: (theme: string) => void
}

export default function Navbar({ theme, setTheme }: IProps) {
  const navigate = useNavigate()

  function toggleTheme() {
    let newTheme: string = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
  }

  return (
    <div className="flex justify-between bg-gray-900 dark:bg-gray-200">
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
