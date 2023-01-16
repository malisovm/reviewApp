import React, { useState } from 'react'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { setTheme, setUser, setAlert, setLocale, setFilter } from '../redux/localSlice'
import { useNavigate } from 'react-router-dom'
import { initialUser } from '../redux/localSlice'
import { DarkModeSwitch } from 'react-toggle-dark-mode'
import useLocMsg from '../localization/useLocMsg'
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined'
import routes from '../routes'
import { useLazySearchReviewsQuery } from '../redux/reviewsApiSlice'

export default function NavbarButtons() {
  const locMsg = useLocMsg()
  const theme = useAppSelector((state) => state.local.theme)
  const user = useAppSelector((state) => state.local.user)
  const locale = useAppSelector((state) => state.local.locale)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [searchReviews] = useLazySearchReviewsQuery()

  function toggleTheme() {
    let newTheme: string = theme === 'light' ? 'dark' : 'light'
    dispatch(setTheme(newTheme))
    localStorage.setItem('theme', newTheme)
  }

  function toggleLang() {
    if (locale === 'en') dispatch(setLocale('ru'))
    else dispatch(setLocale('en'))
  }

  function handleSearch() {
    search &&
      searchReviews(search).then((results) => {
        results.data && dispatch(setFilter({ type: 'search', search: search, ids: results.data }))
        navigate(routes.main)
      })
  }

  return (
    <div className='flex lg:flex-row flex-col flex-nowrap items-center'>
      <span id="Search" className='flex flex-row flex-nowrap items-center'>
        <button className="btn btn-ghost hover:btn-primary" onClick={handleSearch}>
          {locMsg('Shared.search')}
        </button>
        <input type="search" className="input input-sm text-black dark:text-zinc-50 dark:bg-zinc-800" onChange={(e) => setSearch(e.target.value)} />
      </span>

      {!user.username ? (
        <li id="Log in">
          <button
            className="btn btn-ghost hover:btn-primary mx-1"
            onClick={() => {
              navigate(routes.login)
            }}
          >
            {locMsg('Shared.logIn')}
          </button>
        </li>
      ) : (
        <>
          <li id="My reviews">
            <button
              className="btn btn-ghost hover:btn-primary  mx-1"
              onClick={() => {
                navigate(routes.myReviews)
              }}
            >
              <span>
                {user.username} &nbsp; <ThumbUpOutlinedIcon fontSize="small" className="align-text-top" />
                {user.likes}
              </span>
            </button>
          </li>

          {user.role === 'admin' && (
            <li id="Admin access (userlist)">
              <button
                className="btn btn-ghost hover:btn-primary mx-1"
                onClick={() => {
                  navigate(routes.userList)
                }}
              >
                {locMsg('NavbarButtons.userlist')}
              </button>
            </li>
          )}

          <li id="Log out">
            <button
              className="btn btn-ghost hover:btn-primary mx-1"
              onClick={() => {
                dispatch(setUser(initialUser))
                localStorage.removeItem('token')
                dispatch(setAlert({ text: 'You have logged out...', variant: 'alert-success' }))
                navigate(routes.main)
              }}
            >
              {locMsg('NavbarButtons.logOut')}
            </button>
          </li>
        </>
      )}

      <li id="Toggle language">
        <button className="btn btn-ghost hover:btn-primary mx-1" onClick={toggleLang}>
          {locale}
        </button>
      </li>

      <li>
        <DarkModeSwitch
          className="mx-1 bg-transparent place-self-center"
          checked={theme === 'dark' ? true : false}
          onChange={toggleTheme}
          size={50}
        />
      </li>
    </div>
  )
}
