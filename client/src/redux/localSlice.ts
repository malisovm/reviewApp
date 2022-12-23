import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

var initialTheme: string | null
if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
)
  initialTheme = 'dark'
else initialTheme = 'light'

export const initialUser = { name: '', role: 'unauthorized', likes: 0 }

const initialState = {
  theme: initialTheme,
  locale: 'en',
  user: initialUser,
  alert: { text: '', variant: '' },
}

const localSlice = createSlice({
  name: 'local',
  initialState,
  reducers: {
    setLocale(state, action: PayloadAction<string>) {
      state.locale = action.payload
    },
    setTheme(state, action: PayloadAction<string>) {
      state.theme = action.payload
    },
    setUser(state, action: PayloadAction<{ name: string; role: string, likes: number }>) {
      state.user = action.payload
    },
    setAlert(state, action: PayloadAction<{ text: string; variant: string }>) {
      state.alert = action.payload
    },
  },
})

export const { setLocale, setTheme, setUser, setAlert } = localSlice.actions
export default localSlice.reducer
