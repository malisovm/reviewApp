import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setTheme, setUser, setAlert } from '../redux/localSlice'

export default function Navbar() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const theme = useAppSelector((state) => state.local.theme)
  const user = useAppSelector((state) => state.local.user)

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
        {!user.name ? (
          <button
            className="btn btn-primary"
            onClick={() => {
              navigate('/login')
            }}
          >
            Log in
          </button>
        ) : (
          <>
            <button
              className="btn btn-primary"
              onClick={() => {
                navigate('/myreviews')
              }}
            >
              {user.name}
            </button>
            <button
              className="btn btn-primary"
              onClick={() => {
                dispatch(setUser({ name: '', role: 'unauthorized' }))
                dispatch(setAlert({ text: 'You have logged out...', variant: 'alert-success' }))
                navigate('/')
              }}
            >
              Log out
            </button>
          </>
        )}
        <input type="checkbox" className="toggle toggle-primary cursor-pointer align-middle" onClick={toggleTheme} />
      </span>
    </div>
  )
}
