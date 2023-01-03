import React from 'react'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setTheme, setUser, setAlert, setLocale } from '../redux/localSlice'
import { useNavigate } from 'react-router-dom'
import { initialUser } from '../redux/localSlice'
import { DarkModeSwitch } from 'react-toggle-dark-mode'
import useLocMsg from '../localization/useLocMsg'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'

export default function NavbarButtons() {
  const locMsg = useLocMsg()
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
            {locMsg('Shared.logIn')}
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
                {user.name} &nbsp; <ThumbUpOutlinedIcon fontSize="small" className="align-text-top" />
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
                {locMsg('NavbarButtons.userlist')}
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
              {locMsg('NavbarButtons.logOut')}
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
