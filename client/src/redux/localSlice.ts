import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { IState, FilterType } from '../interfaces'

var initialTheme: string | null
if (
  localStorage.theme === 'dark' ||
  (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
)
  initialTheme = 'dark'
else initialTheme = 'light'

export const initialUser = { username: '', role: 'unauthorized', likes: 0 }

const initialState: IState = {
  theme: initialTheme,
  locale: 'en',
  user: initialUser,
  alert: { text: '', variant: '' },
  filter: null
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
    setUser(state, action: PayloadAction<{ username: string; role: string, likes: number }>) {
      state.user = action.payload
    },
    setAlert(state, action: PayloadAction<{ text: string; variant: string }>) {
      state.alert = action.payload
    },
    setFilter(state, action: PayloadAction<FilterType>) {
      state.filter = action.payload
    },
  },
})

export const { setLocale, setTheme, setUser, setAlert, setFilter } = localSlice.actions
export default localSlice.reducer
