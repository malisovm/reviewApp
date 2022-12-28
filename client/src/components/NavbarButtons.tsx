import React from 'react'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setTheme, setUser, setAlert } from '../redux/localSlice'
import { useNavigate } from 'react-router-dom'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { initialUser } from '../redux/localSlice'

export default function NavbarButtons() {
  const theme = useAppSelector((state) => state.local.theme)
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.local.user)
  const navigate = useNavigate()

  function toggleTheme() {
    let newTheme: string = theme === 'light' ? 'dark' : 'light'
    dispatch(setTheme(newTheme))
    localStorage.setItem('theme', newTheme)
  }

  return (
    <>
      {!user.name ? (
        <li><a
          className="btn btn-ghost hover:btn-primary mx-3"
          onClick={() => {
            navigate('/login')
          }}
        >
          Log in
        </a></li>
      ) : (
        <>
          <li><button
            className="btn btn-ghost hover:btn-primary  mx-3"
            onClick={() => {
              navigate('/myreviews')
            }}
          >
            <span>
              {user.name} &nbsp; <ThumbUpIcon fontSize="small" />
              {user.likes}
            </span>
          </button></li>
          {user.role === 'admin' && (
            <li><button
              className="btn btn-ghost hover:btn-primary mx-3"
              onClick={() => {
                navigate('/userlist')
              }}
            >
              Userlist
            </button></li>
          )}
          <li><button
            className="btn btn-ghost hover:btn-primary mx-3"
            onClick={() => {
              dispatch(setUser(initialUser))
              dispatch(setAlert({ text: 'You have logged out...', variant: 'alert-success' }))
              navigate('/')
            }}
          >
            Log out
          </button></li>
        </>
      )}
      <li>
        <input type="checkbox" className="toggle toggle-primary cursor-pointer" onClick={toggleTheme} />
      </li>
    </>
  )
}
