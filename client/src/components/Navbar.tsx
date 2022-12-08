import React from 'react'
import { useNavigate } from 'react-router-dom'

interface IProps {
  darkTheme: boolean
  setDarkTheme: (darkTheme: boolean) => void
}

export default function Navbar({ darkTheme, setDarkTheme }: IProps) {
  const navigate = useNavigate()

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
        <input
          type="checkbox"
          className="toggle toggle-primary cursor-pointer align-middle"
          onClick={() => {
            setDarkTheme(!darkTheme)
          }}
        />
      </span>
    </div>
  )
}
