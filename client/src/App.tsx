import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ReviewEditor from './pages/ReviewEditor'
import Main from './pages/Main'
import MyReviews from './pages/MyReviews'
import { useAppSelector } from './redux/hooks'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Message from './components/Alert'
import Userlist from './pages/Userlist'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { ruMessages } from './localization/ru'
import { enMessages } from './localization/en'
import { IntlProvider } from 'react-intl'
import flatten from 'flat'

export default function App() {
  const theme = useAppSelector((state) => state.local.theme)
  const user = useAppSelector((state) => state.local.user)
  const locale = useAppSelector((state) => state.local.locale)

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
      <IntlProvider locale={locale} messages={flatten(messages[locale as keyof typeof messages])}>
        <Navbar />
        <Message />
        <ThemeProvider theme={muiTheme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<Main />} />
            {!user.name && <Route path="/login" element={<Login />} />}
            {user.name && (
              <>
                <Route path="/revieweditor" element={<ReviewEditor />} />
                <Route path="/myreviews" element={<MyReviews />} />
              </>
            )}
            {user.role === 'admin' && <Route path="/userlist" element={<Userlist />} />}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ThemeProvider>
      </IntlProvider>
    </div>
  )
}
