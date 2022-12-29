import React from 'react'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setTheme, setUser, setAlert, setLocale } from '../redux/localSlice'
import { useNavigate } from 'react-router-dom'
import ThumbUpIcon from '@mui/icons-material/ThumbUp'
import { initialUser } from '../redux/localSlice'
import { DarkModeSwitch } from 'react-toggle-dark-mode'

export default function NavbarButtons() {
  const theme = useAppSelector((state) => state.local.theme)
  const user = useAppSelector((state) => state.local.user)
  const locale = useAppSelector((state) => state.local.locale)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  function toggleTheme() {
    let newTheme: string = theme === 'light' ? 'dark' : 'light'
    dispatch(setTheme(newTheme))
    localStorage.setItem('theme', newTheme)
  }

  function toggleLang() {
    if (locale === 'en') dispatch(setLocale('ru'))
    else dispatch(setLocale('en'))
  }

  return (
    <>
      {!user.name ? (
        <li>
          <a
            className="btn btn-ghost hover:btn-primary mx-1"
            onClick={() => {
              navigate('/login')
            }}
          >
            Log in
          </a>
        </li>
      ) : (
        <>
          <li>
            <button
              className="btn btn-ghost hover:btn-primary  mx-1"
              onClick={() => {
                navigate('/myreviews')
              }}
            >
              <span>
                {user.name} &nbsp; <ThumbUpIcon fontSize="small" />
                {user.likes}
              </span>
            </button>
          </li>
          {user.role === 'admin' && (
            <li>
              <button
                className="btn btn-ghost hover:btn-primary mx-1"
                onClick={() => {
                  navigate('/userlist')
                }}
              >
                Userlist
              </button>
            </li>
          )}
          <li>
            <button
              className="btn btn-ghost hover:btn-primary mx-1"
              onClick={() => {
                dispatch(setUser(initialUser))
                dispatch(setAlert({ text: 'You have logged out...', variant: 'alert-success' }))
                navigate('/')
              }}
            >
              Log out
            </button>
          </li>
        </>
      )}
      <li>
        <button className="btn btn-ghost hover:btn-primary mx-1" onClick={toggleLang}>
          {locale}
        </button>
      </li>
      <li>
        <DarkModeSwitch
          className="mx-1 bg-transparent"
          checked={theme === 'dark' ? true : false}
          onChange={toggleTheme}
          size={52}
        />
      </li>
    </>
  )
}
