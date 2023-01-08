import React, { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ReviewEditor from './pages/ReviewEditor'
import Main from './pages/Main'
import MyReviews from './pages/MyReviews'
import { useAppSelector, useAppDispatch } from './redux/hooks'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Userlist from './pages/Userlist'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ruMessages } from './localization/ru'
import { enMessages } from './localization/en'
import { IntlProvider } from 'react-intl'
import routes from './routes'
import Alert from './components/Alert'
import { useCheckSessionMutation } from './redux/apiSlice'
import { setUser } from './redux/localSlice'

export default function App() {
  const theme = useAppSelector((state) => state.local.theme)
  const user = useAppSelector((state) => state.local.user)
  const locale = useAppSelector((state) => state.local.locale)
  const dispatch = useAppDispatch()
  const [checkSession] = useCheckSessionMutation()

  useEffect(() => {
    var token = localStorage.getItem('token')
    token &&
      checkSession(token)
        .unwrap()
        .then((result) => {
          dispatch(setUser(result))
        })
  }, [])

  const muiTheme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: theme as 'light' | 'dark',
          primary: {
            main: '#4506CB',
          },
        },
      }),
    [theme],
  )

  const messages = {
    ru: ruMessages,
    en: enMessages,
  }

  return (
    <div
      data-theme={theme === 'dark' ? 'dark' : 'light'}
      className={`${theme === 'dark' ? 'dark' : ''} bg-stone-200 dark:bg-zinc-800 min-h-screen`}
    >
      <IntlProvider locale={locale} messages={messages[locale as keyof typeof messages]}>
        <Navbar />
        <Alert />
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          <Routes>
            <Route path={routes.main} element={<Main />} />
            {!user.username && <Route path={routes.login} element={<Login />} />}
            {user.username && (
              <>
                <Route path={routes.reviewEditor} element={<ReviewEditor />} />
                <Route path={routes.myReviews} element={<MyReviews />} />
              </>
            )}
            {user.role === 'admin' && <Route path={routes.userList} element={<Userlist />} />}
            <Route path="*" element={<Navigate to={routes.main} replace />} />
          </Routes>
        </ThemeProvider>
      </IntlProvider>
    </div>
  )
}
